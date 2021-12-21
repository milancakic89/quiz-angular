import { NonNullAssert } from '@angular/compiler';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalWrapper } from '../modal-service';
import { QuestionService } from '../questions/questions.service';
import { Answers, Question } from '../questions/types';
import { Configuration } from '../shared/config.service';
import { NotificationService } from '../shared/notification.service';
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
              private notificationService: NotificationService,
              private playService: PlayService,
              private questionService: QuestionService) { }

  get attempts(){ return this._attempts }
  set attempts(value){this._attempts = value}

  get userContributions() {return this.config.user.getValue().categories as unknown as any}

  public time = 15;
  public score = 0;

  public questionCount = 0;
  public question: Question | any = null;
  public timeInterval: any = null;
  public questionSelected = false;
  public selectedLetter = '';
  public playCategory = '';
  public showModal = true;
  public lives = 0;
  public nextQuestionInterval = 300;
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
        console.log(user)
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

  public isCategoryAllowed(category: String){
    if(category === 'GEOGRAFIJA'){
      return true;
    }
    const userContribution = this.userContributions.find((c: any) => c.category === category);
    if(userContribution){
      return userContribution.questions_added >= 10;
    }
    return false;
  }

  ngOnDestroy(){
    this.modal.startGame.next(false);
    this.playService.allowBackButton = true;
    clearInterval(this.timeInterval);
  }

  public initGame(){
    this.modal.startGame.next(true)
    this.playService.allowBackButton = false;
    this.score = 0;
    this.time = 15;
    this.questionCount = 0;
    this.getQuestion();
  }

  public async getQuestion(){
    if (this._questionCounter > 15 || !this.attempts.length){
      this.gameOver('End of game');
    }
    this._questionCounter++;
    const { data, success } = await this.questionService.getSingleQuestion(this.playCategory)
    if(success){
      this.question = data;
      this.selectedLetter = '';
      this.questionSelected = false;
      this.time = 15;
      this.initTime();
    }else{
      clearInterval(this.timeInterval);
      this.notificationService.notification.emit({
        success: false,
        message: 'Neuspelo izvlacenje pitanja iz baze, pokusajte ponovo'
      })
      this.router.navigateByUrl('/profile')
    }
  }

  public initTime(){
    clearInterval(this.timeInterval)
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
  this.updateQuestion(false)  
}

public gameOver(message?: string){
  this.stopTime();
  let points = 0;
  if(this.score > 2 && this.score <= 7){
    points = 1;
  }
  if(this.score > 7 && this.score <= 11){
    points = 2
  }
  if (this.score > 11 && this.score <= 14){
    points = 3;
  }
  if (this.score > 14) {
    points = 5;
  }
  if(this.score < 2){
    this.reduceOneLife();
  }
  this.modal.gameResults.next({
    success: points !== 0,
    results: points,
    showModal: true
  });

  this.playService.allowBackButton = true;
  this.score = 0;
  this.attempts = [1, 1, 1]
  this.modal.startGame.next(false)

}

public closeModal(category: string, allowedCategory: string){
  const allowed = this.isCategoryAllowed(allowedCategory);
  if (!allowed){
    return;
  }
  this.playCategory = category;
  
  setTimeout(()=>{
    this.showModal = false;
    this.initGame();
  }, 1600)
  
}

  public async onSelectedAnswer(answer: Answers){
    if(this.questionSelected){
      return;
    }
    this.questionSelected = true;
    this.selectedLetter = answer.letter;
    this.stopTime();
    const correct = answer.letter === this.question.correct_letter;
    this.updateQuestion(correct);
  }

  public async updateQuestion(correct: boolean){
    const { data, success } = await this.playService.checkQuestion(this.question._id, correct)
    if(success){
      if (data) {
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
    }else{
      clearInterval(this.timeInterval)
      this.playService.allowBackButton = true;
      this.notificationService.notification.emit({
        success: false,
        message: 'Neuspelo izvlacenje pitanja iz baze, pokusajte ponovo'
      });
      //todo set user not playing in DB and then router him
      // this.router.navigateByUrl('/profile');

    }
  }

  public stopTime(){
    clearInterval(this.timeInterval);
  }

  public async reduceOneLife(){
    const { data, success } = await this.playService.reduceOneLife()
    if(success){
      this.config.user.next(data)
    }
  }
  
  private reduceAttempts(){
    if(this._attempts.length > 0){
      this.attempts.pop();
    }
    
  }

  private _attempts = [1,1,1];
  private _questionCounter = 1;
  private _userId: string = '';

}
