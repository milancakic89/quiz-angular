import { NonNullAssert } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalWrapper } from '../modal-service';
import { QuestionService } from '../questions/questions.service';
import { Answers, Question } from '../questions/types';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {

  constructor(private modal: ModalWrapper, 
              private router: Router,
              private questionService: QuestionService) { }

  get attempts(){ return this._attempts }
  set attempts(value){this._attempts = value}

  public time = 15;
  public score = 0;

  public questionCount = 0;
  public questions: Question[] = [];
  public timeInterval: any = null;
  public questionSelected = false;
  public selectedLetter = '';
  public nextQuestionInterval = 1000;
  public currentQuestion: Question = {
    answeredCorrect: 0,
    answeredWrong: 0,
    question_text: '',
    status: 'PRIHVACENO',
    answers: [],
    correct_letter: '',
    correct_text: '',
    opened: false
  }

  ngOnInit(): void {
    this.modal.openPlayModal.emit(true);
    this.modal.startGame.subscribe(bool =>{
      if(bool){
        this.score = 0;
        this.time = 15;
        this.questionCount = 0;
        this.initGame();
      }
    })
  }

  ngOnDestroy(){
    clearInterval(this.timeInterval);
    this.modal.openPlayModal.emit(false);
  }

  public initGame(){
    const db = this.questionService.getDB().questions;
    this.questions = db;
    this.getQuestion();
  }

  public getQuestion(){
    this.selectedLetter = '';
    this.time = 15;
    if(this.questions[this.questionCount]){
      this.currentQuestion = JSON.parse(JSON.stringify(this.questions[this.questionCount]))
      this.questionCount++;
      this.questionSelected = false;
      this.initTime();
    }else{
      this.gameOver('No more questions');
    }
  }

  public initTime(){
    this.timeInterval = setInterval(()=>{
      if(this.time > 0){
       this.time--;
      }else{
        this.timeWarning();
      }
    },1000)
}

public timeWarning(){
  this.questionSelected = true;
  this.stopTime();
  setTimeout(()=>{
    alert('getting question')
    this.getQuestion();  
  },this.nextQuestionInterval)
  
}

public gameOver(message?: string){
  this.stopTime();
  alert(message)
  this.modal.startGame.emit(false)
  this.router.navigateByUrl('/profile');
}

  public onSelectedAnswer(answer: Answers){
    this.selectedLetter = answer.answer_letter;
    this.stopTime();
    this.questionSelected = true;
    if(answer.answer_letter === this.currentQuestion.correct_letter){
       this.score++;
    }else{
      this.attempts.pop();
    }
    setTimeout(()=>{
      if(this.attempts.length){
        this.getQuestion();
      }else{
        this.gameOver('You have missed 3 times');
      }
     
    },this.nextQuestionInterval)
  }

  public stopTime(){
    clearInterval(this.timeInterval);
  }

  public reduceOneAttempt(){
      this.reduceAttempts();
  }
  private reduceAttempts(){
    if(this._attempts.length > 0){
      this.attempts.pop();
    }
  }

  private _attempts = [1,1,1];

}
