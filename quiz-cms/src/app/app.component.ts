import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { Feedback, FeedbackMessageService } from './feedback.service';
import { GameData, ModalWrapper } from './modal-service';
import { Configuration } from './shared/config.service';
import { Noth, NotificationService } from './shared/notification.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Quiz';

  constructor(private config: Configuration, 
              private modal: ModalWrapper,
              private service: AppService,
              private notificationService: NotificationService,
              private feedbackService: FeedbackMessageService,
              private router: Router){}
  get isRoot(){return this.config.isRoot}
  get isLogged(){return this.config.logged}

  public user: any;
  public showModal = false;
  public gameRunning = false;
  public feedbackMessage = 'test';
  public feedbackTimeInSeconds = 5;
  public spinner = true;
  public lives: any = [];
  public showFeedback = false;
  public successFeedback = true;
  public gameResults: GameData = {
    success: false,
    showModal: false,
    results: null
  };


  ngOnInit(){
    this.notificationService.notification.subscribe((noth: Noth) =>{
      this.successFeedback = noth.success;
      this.showFeedback = true;
      this.feedbackMessage = noth.message;
      this.hideFeedback();
    });


    if(!this.user && !localStorage.getItem('access')){
        this.spinner = false;
    }

    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
        this.spinner = false;
        this.lives = Array(user.lives);
      }
    })
    if(localStorage.getItem('access') && !this.config.logged){
          this.config.attemptAutoLogin();
          setTimeout(()=>{
            this.spinner = false;
          }, 3000)
    }

  this.modal.gameResults.subscribe(gameData =>{
    if(gameData){
      this.gameRunning = false;
      this.modal.startGame.next(false);
      this.gameResults.noQuestions = gameData.noQuestions;
      this.gameResults.results = gameData.results;
      this.gameResults.showModal = gameData.showModal;
      this.gameResults.success = gameData.success;
      this.addToScore(this.gameResults.results)
      this.updateScore();
    }
   
  })

    this.modal.startGame.subscribe(bool =>{
      this.gameRunning = bool;
  });


    if(this._initRedirect){
      this._initRedirect = false;
      this.router.navigateByUrl('');
      return;
    }

  }

  
  public hideFeedback(){
    setTimeout(()=>{
      this.showFeedback = false;
      this.feedbackMessage = '';
    }, 3000)
  }

  public async claimDailyReward(){
    const { data, success} = await this.service.claimDailyReward();
    if(success){
      this.user = data;
    }
  }

  public onGameFinish(){
    setTimeout(() => {
      this.gameResults.noQuestions = false;
      this.gameResults.results = null;
      this.gameResults.success = false;
      this.gameResults.showModal = false;
    }, 1000);
    this.router.navigateByUrl('/profile');
  }

  public addToScore(score: number){
    this.user.score += score;
  }

  private async updateScore(){
    await this.service.updateScore(this.user.score);
    this.onGameFinish();
  }

  public play(){
    this.showModal = true;
  }

  public logout(){
    this.config.logout();
  }

  private _initRedirect = true;
}
