import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuestionService } from '../questions/questions.service';
import { Category, Question } from '../questions/types';
import { NotificationService } from '../shared/notification.service';

type Correct = 'A' | 'B' | 'C' | 'D';
@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.scss']
})
export class ContributeComponent implements OnInit {

  constructor(private questionService: QuestionService, private notificationService: NotificationService) { }

  get newQuestion(){ return this._newQuestion}
  set newQuestion(value){ this._newQuestion = value}

  public items = ['A','B','C','D'];
  public categories = [
    'Geografija',
    'Istorija',
    'Filmovi i Serije',
    'Poznate licnosti',
    'Sport'
  ]

  public selected: Correct = 'A';
  public selectedCategory: Category = 'Geografija';

  ngOnInit(): void {
  }

  public onChange(){
    this.newQuestion.correct = this.selected;
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
      category: this.selectedCategory,
      correct_letter: this.selected,
      correct_text: this.newQuestion.correct_text
    }
    this.addQuestion(question)
    form.resetForm();
  }

  public async addQuestion(question: Question){
    const { success } = await this.questionService.addQuestion(question);
    if(success){
      this.notificationService.notification.emit({success: true,message: 'Pitanje upesno dodato'})
    }
  }

  private _newQuestion = {
    question_text: '',
    correct_text: '',
    category: '',
    letter_a: '',
    letter_b: '',
    letter_c: '',
    letter_d: '',
    correct: 'A'
  }

}
