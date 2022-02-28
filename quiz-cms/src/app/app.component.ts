import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { Feedback, FeedbackMessageService } from './feedback.service';
import { GameData, ModalWrapper } from './modal-service';
import { Configuration, User } from './shared/config.service';
import { Noth, NotificationService } from './shared/notification.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from './profile/profile.service';
import { SocketService } from './socket-service';
import { PlayService } from './play/play.service';
import { TournamentService } from './tournament/tournament.service';
import { SettingsService } from './settings/settings.service';
import { Settings } from './settings/form/form.component';

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
              private playservice: PlayService,
              private settings: SettingsService,
              private profileService: ProfileService,
              private tournamentService: TournamentService,
              private notificationService: NotificationService,
              private feedbackService: FeedbackMessageService,
              private router: Router){}
  get isRoot(){return this.config.isRoot}
  get isLogged(){return this.config.logged}

  get room() { return this.tournamentService.room}

  public user: User = {} as User;
  public showModal = false;
  public animateBox = false;
  public gameRunning = false;
  public feedbackMessage = 'test';
  public feedbackTimeInSeconds = 5;
  public spinner = false;
  public showLivesTimer = false;
  public lives_timer_delay = false;
  public dailyModal = false;
  public lives: any = [];
  public showFeedback = false;
  public resetAvailable = false;
  public lives_interval: any = undefined;
  public loadingPercent = 0;
  public minutes = 0;
  public seconds = 0;
  public minutesString = '00';
  public secondsString = '00';
  public ticketReward = 0;
  public ticketAnimationCounter = 0;
  public newName = '';

  public showNewNameModal = false;
  public allowRewardBtn = false;
  public successFeedback = true;
  public showRequestsModal = false;

  public centerContent = true;
  public stars: number[] = [];
  public gameResults: GameData = {
    success: false,
    showModal: false,
    results: null
  };

  @HostListener('window:resize')
  checkCenterLogin(){
    if(window.innerHeight > 650){
      this.centerContent = true;
    }
  }

  ngOnInit(){
    if(window.innerHeight > 650){
      this.centerContent = true;
    }
    this.feedbackService.DailyPrice.subscribe(bool =>{
      this.resetAvailable = bool;
    })
    this.notificationService.notification.subscribe((noth: Noth) =>{
      this.successFeedback = noth.success;
      this.showFeedback = true;
      this.feedbackMessage = noth.message;
    });
    setTimeout(()=>{
      this.lives_timer_delay = true;
    }, 2000)

    if(!this.user && !localStorage.getItem('access')){
        this.spinner = false;
        this.loadingPercent = 10;
    }

    this.config.user.subscribe(user =>{
      if(user){
        if(user.name === 'Kvizoman'){
          this.showNewNameModal = true;
        }
        if (user.friendRequests.length > 0 && !localStorage.getItem('modal')){
          this.showRequestsModal = true;
        }

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

    if(this._initRedirect && !location.href.includes('privacy-and-terms')){
      this._initRedirect = false;
      this.router.navigateByUrl('');
      return;
    }
  }

  public checkFriendRequests(){
    this.showRequestsModal = false;
    localStorage.setItem('modal', 'something')
  }

  public async saveName(){
    if(this.newName === ''){
      return;
    }
    const settings: Settings = {
      name: this.newName,
      image: null
    }
    const {success} = await this.settings.saveSettings(settings);
    if(!success){
      console.log('not saved')
    }
    this.showNewNameModal = false;
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

  public openDailyReward(){
    this.dailyModal = true;
    this.claimDailyReward();
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
      setTimeout(()=>{
        this.loadingPercent = 50;
      },100)
      await this.config.attemptAutoLogin();
      this.loadingPercent = 90;
      setTimeout(()=>{
        this.spinner = false;
        this.router.navigateByUrl('/profile')
      },300)
     }else{
      this.spinner = false;
     }

  }

  
  public hideFeedback(){
    this.animateBox = true;
    setTimeout(() =>{
      this.showFeedback = false;
      this.animateBox = false;
      this.feedbackMessage = '';
    }, 500)

  }

  public async claimDailyReward(){
    const { data, success, tickets } = await this.service.claimDailyReward();
    if(success){
      this.animateReward(tickets, data);
    }
  }

  public closeDailyReward(){
    this.dailyModal = false;
    this.resetAvailable = false;
  }

  public animateReward(tickets: number, user: User){
    this.allowRewardBtn = false;
    this.ticketAnimationCounter = 0;
    this.ticketReward = 0;
    const animate = () =>{
      if(this.ticketAnimationCounter >= 20){
        this.ticketReward = tickets;
        this.user = user;
        this.allowRewardBtn = true;
      }else{
        setTimeout(()=>{
          this.ticketAnimationCounter++;
          animate();
        }, 150)
      }
    }

    animate();
  }

  public animateBorderOnNumbers(arr: number[]){
    let result = arr.includes(this.ticketAnimationCounter);
    return result;
  }

  public onGameFinish(){
      this.playservice.allowBackButton = true;  
      this.gameResults.noQuestions = false;
      this.gameResults.results = null;
      this.gameResults.success = false;
      this.gameResults.showModal = false;
      this.router.navigateByUrl('/profile');
  }

  public addToScore(score: number){
    this.user.score += score;
    this.animateStars(score)
  }

  public animateStars(amount: number){
    this.stars = [];
    let counter = 0;

    const animate = () => {
      if(counter >= amount){
        return;
      }
      setTimeout(()=>{
        this.stars.push(1);
        counter++;
        animate()
      }, 500)
    }

    animate()
   
  }

  private async updateScore(){
    await this.service.updateScore(this.user.score);
  }

  public play(){
    this.showModal = true;
  }

  public logout(){
    this.config.logout();
  }

  private _initRedirect = true;
}
