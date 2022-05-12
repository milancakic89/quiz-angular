import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuestionService } from '../questions/questions.service';
import { Category, Question } from '../questions/types';
import { NotificationService } from '../shared/notification.service';
import { Configuration } from '../shared/config.service';
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { SocketService } from '../socket-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

export type QuestionType = 'PICTURE' | 'REGULAR' | 'WORD' |'MODAL';
@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.scss']
})
export class ContributeComponent implements OnInit, OnDestroy {

  constructor(private questionService: QuestionService, 
              private config: Configuration,
              private router: Router,
              private storage: AngularFireStorage,
              private socketService: SocketService,
              private notificationService: NotificationService,
              private http: HttpClient) { }

  @ViewChild('upload') public upload: any;

  get newQuestion(){ return this._newQuestion}
  set newQuestion(value){ this._newQuestion = value}

  public questionType: QuestionType = 'MODAL';

  public selectedImage = null;


  public items = ['A','B','C','D'];
  public categories = 
    [
      { title: 'GEOGRAFIJA', value: 'GEOGRAFIJA' },
      { title: 'ISTORIJA', value: 'ISTORIJA' },
      { title: 'POZNATE LICNOSTI', value: 'POZNATE LICNOSTI' },
      { title: 'MUZIKA', value: 'MUZIKA' },
      { title: 'FILMOVI I SERIJE', value: 'FILMOVI I SERIJE' },
      { title: 'SPORT', value: 'SPORT' },
      { title: 'RAZNO', value: 'RAZNO' },
    ]

  public selectedCategory: Category = 'GEOGRAFIJA';

  ngOnInit(): void {
    this.subscription = this.socketService.socketData.subscribe(data =>{
      if (data && (data.event === 'ADD_QUESTION' || data.event === 'ADD_IMAGE_QUESTION')){
        this.notificationService.notification.emit({success: true, message: 'Pitanje uspesno dodato'})
        this.router.navigateByUrl('/profile')
      }
    })
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
 
  public onCancel(){
    this.questionType = 'MODAL';
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
      imageUrl: '',
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
      correct_letter: this.newQuestion.correct,
      correct_text: this.newQuestion.correct_text
    }
    if(this.questionType === 'PICTURE'){
      const filePath = Date.now() + this._newQuestion.image.name;
      const fileRef = this.storage.ref(filePath)
      this.storage.upload(filePath, this._newQuestion.image)
      .snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( (url: any) =>{
            const imageUrl = url.split('&token')[0];
            question.imageUrl = imageUrl;
            question.firebasePath = filePath;
            this.addQuestion(question);
          });
        })
      )
      .subscribe()
      
      
    }else{
      this.addQuestion(question)
    }
    form.resetForm();
  }


  public onImageChange(){
    this._newQuestion.image = this.upload.nativeElement.files[0];
  }

  public addQuestion(question: Question){
    this.socketService.emit('ADD_QUESTION', { question: question })
  }

  // public addImageQuestion(question: any) {
  //   this.socketService.emit('ADD_QUESTION', { question: question, _id: this.config.userValue._id })
  // }


  private _newQuestion = {
    question_text: '',
    correct_text: '',
    image: null as any,
    category: '',
    letter_a: '',
    letter_b: '',
    letter_c: '',
    letter_d: '',
    correct: 'A'
  }

  private subscription: Subscription = null as unknown as Subscription;

}

