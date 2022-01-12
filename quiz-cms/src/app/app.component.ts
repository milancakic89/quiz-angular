import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { Feedback, FeedbackMessageService } from './feedback.service';
import { GameData, ModalWrapper } from './modal-service';
import { Configuration, User } from './shared/config.service';
import { Noth, NotificationService } from './shared/notification.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from './profile/profile.service';

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
              private profileService: ProfileService,
              private notificationService: NotificationService,
              private feedbackService: FeedbackMessageService,
              private router: Router){}
  get isRoot(){return this.config.isRoot}
  get isLogged(){return this.config.logged}

  public user: User = {} as User;
  public showModal = false;
  public gameRunning = false;
  public feedbackMessage = 'test';
  public feedbackTimeInSeconds = 5;
  public spinner = false;
  public showLivesTimer = false;
  public lives_timer_delay = false;
  public lives: any = [];
  public showFeedback = false;
  public resetAvailable = false;
  public lives_interval: any = undefined;
  public minutes = 0;
  public seconds = 0;
  public minutesString = '00';
  public secondsString = '00';
  public successFeedback = true;
  public testTime = new Date(Date.now() + 30000);
  public gameResults: GameData = {
    success: false,
    showModal: false,
    results: null
  };


  ngOnInit(){
    this.feedbackService.DailyPrice.subscribe(bool =>{
      this.resetAvailable = bool;
    })

    this.notificationService.notification.subscribe((noth: Noth) =>{
      this.successFeedback = noth.success;
      this.showFeedback = true;
      this.feedbackMessage = noth.message;
      this.hideFeedback();
    });
    setTimeout(()=>{
      this.lives_timer_delay = true;
    }, 2000)

    if(!this.user && !localStorage.getItem('access')){
        this.spinner = false;
    }

    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
        this.spinner = false;
        this.lives = Array(user.lives);
        if(this.user.lives === 0){
          const timer = this.profileService.calculateResetTime(this.user.lives_timer_ms);
          this.minutes = timer.minutes;
          this.seconds = timer.seconds;
          this.minutesString = this.prefixNumberWithZero(this.minutes);
          this.secondsString = this.prefixNumberWithZero(this.seconds);
          this.showLivesTimer = true;
          this.countdown();
        }else{
          this.showLivesTimer = false;
        }
      }
    })

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

    this.autologin();

    if(this._initRedirect){
      this._initRedirect = false;
      this.router.navigateByUrl('');
      return;
    }
  }

  public countdown(){
    clearInterval(this.lives_interval);
    this.lives_interval = setInterval(()=>{
      this.calculateCountdown();
    }, 1000)
  }

  public prefixNumberWithZero(num: number){
    if(num > 9 || num < 0){
      return `${num}`;
    }
    return `0${num}`;
  }

  public calculateCountdown(){
      this.seconds--;
      if(this.seconds < 0){
        if(this.minutes === 0){
          clearInterval(this.lives_interval);
          this.refreshUser();
          return;
        }
        this.seconds = 59;
        this.minutes--;
      }
      this.minutesString = this.prefixNumberWithZero(this.minutes);
      this.secondsString = this.prefixNumberWithZero(this.seconds);
  }

  public async refreshUser(){
    const { data, success } = await this.config.refreshUser();
    if(success){
      this.config.user.next(data);
    }
  }

  public async autologin(){
    this.spinner = true;
    if(localStorage.getItem('access') && !this.config.logged){
      await this.config.attemptAutoLogin();
      this.spinner = false;
      this.router.navigateByUrl('/profile')
     }
     this.spinner = false;
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
      this.resetAvailable = false;
    }
  }

  public onGameFinish(){
    setTimeout(() => {
      this.gameResults.noQuestions = false;
      this.gameResults.results = null;
      this.gameResults.success = false;
      this.gameResults.showModal = false;
      this.router.navigateByUrl('/profile');
    }, 1000);
  }

  public addToScore(score: number){
    this.user.score += score;
  }

  private async updateScore(){
    await this.service.updateScore(this.user.score);
    this.onGameFinish();
    this.router.navigateByUrl('/profile');
  }

  public play(){
    this.showModal = true;
  }

  public logout(){
    this.config.logout();
  }

  private _initRedirect = true;
}
