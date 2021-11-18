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
  public question: Question | any = null;
  public timeInterval: any = null;
  public questionSelected = false;
  public selectedLetter = '';
  public showModal = true;
  public nextQuestionInterval = 1000;
  public currentQuestion: Question = {
    question: '',
    status: 'NA CEKANJU',
    answers: [],
    correct_letter: '',
    correct_text: '',
    opened: false
  }

  ngOnChanges(): void {
    this.modal.startGame.subscribe(bool =>{
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
    this.getQuestion();
  }

  public getQuestion(){
    if (this._questionCounter > 15 || !this.attempts.length){
      this.gameOver('End of game');
    }
    this._questionCounter++;
    this.questionSelected = false;
    this.questionService.getSingleQuestion().subscribe((data: any) =>{
      this.question = data.data;
      this.selectedLetter = '';
      this.time = 15;
      this.initTime();
    })

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
  if(this.score > 5 && this.score <= 8){
    points = 1;
  }
  if(this.score > 8 && this.score <= 11){
    points = 2
  }
  if (this.score > 11 && this.score <= 14){
    points = 3;
  }
  if (this.score === 15) {
    points = 5;
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
    this.selectedLetter = answer.letter;
    this.stopTime();
    this.questionSelected = true;
    if(answer.letter === this.question.correct_letter){
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
  private _questionCounter = 1;

}
