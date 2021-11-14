import { NonNullAssert } from '@angular/compiler';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalWrapper } from '../modal-service';
import { QuestionService } from '../questions/questions.service';
import { Answers, Question } from '../questions/types';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnDestroy, OnChanges {

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
  public showModal = true;
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

  ngOnChanges(): void {
    this.modal.startGame.subscribe(bool =>{
      console.log(bool)
      if(bool){
        this.initGame();
      }
    })
  }

  ngOnDestroy(){
    clearInterval(this.timeInterval);
  }

  public initGame(){
    this.modal.startGame.next(true)
    this.score = 0;
    this.time = 15;
    this.questionCount = 0;
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
    this.getQuestion();  
  },this.nextQuestionInterval)
  
}
public gameOver(message?: string){
  this.stopTime();
  let points = 0;
  if(this.score > 2 && this.score <= 3){
    points = 1;
  }
  if(this.score > 3 && this.score <= 5){
    points = 2
  }
  if(this.score > 5 && this.score <= 9){
    points = 3;
  }
  this.modal.gameResults.next({
    success: points !== 0,
    results: points,
    showModal: true
  })
  this.modal.startGame.next(false)
}

public closeModal(){
  this.showModal = false;
  this.initGame();
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
