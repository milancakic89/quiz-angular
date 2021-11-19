import { NonNullAssert } from '@angular/compiler';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalWrapper } from '../modal-service';
import { QuestionService } from '../questions/questions.service';
import { Answers, Question } from '../questions/types';
import { Configuration } from '../shared/config.service';
import { PlayService } from './play.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnDestroy, OnChanges, OnInit {

  constructor(private modal: ModalWrapper, 
              private router: Router,
              private config: Configuration,
              private playService: PlayService,
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
  public lives = 0;
  public nextQuestionInterval = 1000;
  public currentQuestion: Question = {
    question: '',
    status: 'NA CEKANJU',
    answers: [],
    correct_letter: '',
    correct_text: '',
    opened: false
  }
  ngOnInit(){
    this.config.user.subscribe(user =>{
      if(user){
        this.lives = user.lives;
        if(this.lives === 0){
          setTimeout(()=>{
              this.router.navigateByUrl('/profile')
          }, 1000)
        }
      }
    })
  }

  ngOnChanges(): void {
    this.modal.startGame.subscribe(bool =>{
      if(bool){
        this.initGame();
      }
    })

  }

  ngOnDestroy(){
    this.modal.startGame.next(false)
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
      if(data && data.success){
        this.question = data.data;
        this.selectedLetter = '';
        this.time = 15;
        this.initTime();
      }else{
        this.gameOver('No quesions')
      }
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

  public async onSelectedAnswer(answer: Answers){
    this.selectedLetter = answer.letter;
    this.stopTime();
    this.questionSelected = true;
    const correct = answer.letter === this.question.correct_letter;
    this.playService.checkQuestion(this.question._id, correct).subscribe((data: any) =>{
      if(data && data.success){
        if (data.correct) {
          this.score++;
        } else {
          this.reduceAttempts();
        }
        setTimeout(() => {
          if (this.attempts.length) {
            this.getQuestion();
          } else {
            this.gameOver('You have missed 3 times');
          }

        }, this.nextQuestionInterval)
      }
    })
  }

  public stopTime(){
    clearInterval(this.timeInterval);
  }

  public reduceOneLife(){
      this.playService.reduceOneLife().subscribe((data: any) => {
        this.config.user.subscribe(user => {
          if (user) {
              user.lives = data.lives;
          }
        })
      })
  }
  private reduceAttempts(){
    if(this._attempts.length > 0){
      this.attempts.pop();
    }
    if (this.attempts.length === 0) {
      console.log('reducing')
      this.reduceOneLife();
    }
    
  }

  private _attempts = [1,1,1];
  private _questionCounter = 1;
  private _userId: string = '';

}
