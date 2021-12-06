import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuestionService } from '../questions/questions.service';
import { Category, Question } from '../questions/types';
import { NotificationService } from '../shared/notification.service';
import { map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Configuration } from '../shared/config.service';

type Correct = 'A' | 'B' | 'C' | 'D';
export type QuestionType = 'PICTURE' | 'REGULAR' | 'MODAL';
@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.scss']
})
export class ContributeComponent implements OnInit {

  constructor(private questionService: QuestionService, 
              private config: Configuration,
              private notificationService: NotificationService,
              private http: HttpClient) { }

  @ViewChild('upload') public upload: any;

  get newQuestion(){ return this._newQuestion}
  set newQuestion(value){ this._newQuestion = value}

  public questionType: QuestionType = 'MODAL';

  public selectedImage = null;

  public items = ['A','B','C','D'];
  public categories = [
    'Geografija',
    'Istorija',
    'Filmovi i Serije',
    'Poznate licnosti',
    'Razno',
    'Sport'
  ]

  public selected: Correct = 'A';
  public selectedCategory: Category = 'Geografija';

  ngOnInit(): void {
  }

  public onChange(){
    
  }

  public changeType(type: QuestionType){
    this.questionType = type;
  }

  public onFormSubmit(form: NgForm){
    if(this._newQuestion.correct === 'A'){
      this.newQuestion.correct_text = this._newQuestion.letter_a
    }
    if(this._newQuestion.correct === 'B'){
      this.newQuestion.correct_text = this._newQuestion.letter_b
    }
    if(this._newQuestion.correct === 'C'){
      this.newQuestion.correct_text = this._newQuestion.letter_c
    }
    if(this._newQuestion.correct === 'D'){
      this.newQuestion.correct_text = this._newQuestion.letter_d
    }
 
    const question: Question = {
      question: this._newQuestion.question_text,
      answers: [
        {
          text: this._newQuestion.letter_a,
          letter: 'A',
        },
        {
          text: this._newQuestion.letter_b,
          letter: 'B',
        },
        {
          text: this._newQuestion.letter_c,
          letter: 'C',
        },
        {
          text: this._newQuestion.letter_d,
          letter: 'D',
        }
      ],
      type: this.questionType,
      category: this.selectedCategory,
      correct_letter: this.selected,
      correct_text: this.newQuestion.correct_text
    }
    if(this.questionType === 'PICTURE'){
      const formData = new FormData();
      formData.append('image', this._newQuestion.image);
      let progress = 0;

      this.http.post('http://localhost:3000/add-image-question', formData, {
        headers: {
          Authorization: "Bearer " + this.config.token
        }
      })
        .subscribe((response: any) =>{
          if (response.success){
            question.imageUrl = response.data;
            this.addImageQuestion(question)
          }

        })
      
      
    }else{
      this.addQuestion(question)
    }
    // form.resetForm();
    form.resetForm();
  }

  public onImageChange(){
    this._newQuestion.image = this.upload.nativeElement.files[0];
  }

  public async addQuestion(question: Question){
    const { success } = await this.questionService.addQuestion(question);
    if(success){
      this.notificationService.notification.emit({success: true,message: 'Pitanje upesno dodato'})
    }
  }

  public async addImageQuestion(question: any) {

    const { success } = await this.questionService.addImageQuestion(question);
    if (success) {
      this.notificationService.notification.emit({ success: true, message: 'Pitanje upesno dodato' })
    }
  }


  private _newQuestion = {
    question_text: '',
    correct_text: '',
    image: '',
    category: '',
    letter_a: '',
    letter_b: '',
    letter_c: '',
    letter_d: '',
    correct: 'A'
  }

}
