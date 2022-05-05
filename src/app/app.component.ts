import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppService } from './app.service';
import { FeedbackMessageService } from './feedback.service';
import { GameData, ModalWrapper } from './modal-service';
import { Configuration, User } from './shared/config.service';
import { Noth, NotificationService } from './shared/notification.service';
import { ProfileService } from './profile/profile.service';
import { SocketResponse, SocketService } from './socket-service';
import { PlayService } from './play/play.service';
import { TournamentService } from './tournament/tournament.service';
import { SettingsService } from './settings/settings.service';
import { Settings } from './settings/form/form.component';
import { Subscription } from 'rxjs';
import { Device, getConfiguration } from './device-configuration';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Quiz';

  constructor(private config: Configuration, 
              private modal: ModalWrapper,
              private service: AppService,
              private socketService: SocketService,
              private playservice: PlayService,
              private settings: SettingsService,
              private activatedRoute: ActivatedRoute,
              private profileService: ProfileService,
              private tournamentService: TournamentService,
              private notificationService: NotificationService,
              private feedbackService: FeedbackMessageService,
              private router: Router){}
  get isRoot(){return this.config.isRoot}
  get isLogged(){return this.config.logged}

  get room() { return this.tournamentService.room}
  get EMMITED(){return this.socketService.EMITED}
  get RECEIVED_EVENT() { return this.socketService.RECEIVED_EVENT }
  get RECEIVED_DATA() { return this.socketService.RECEIVED_DATA }

  public showNavigation = true;
  public RECEICED_TEMP = {} as unknown as any;

  public device: Device = {
    width: 0,
    height: 0,
    deviceFounded: false
  }

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
  public loadingPercent = 20;
  public loadingInterval = null as unknown as any;
  public minutes = 0;
  public seconds = 0;
  public minutesString = '00';
  public secondsString = '00';
  public ticketReward = 0;
  public ticketAnimationCounter = 0;
  public newName = '';
  public autologinReceived = false;

  public showCode = false;

  public invitedToRoomName = '';
  public invitedBy = '';
  public invited = false;

  public showNewNameModal = false;
  public allowRewardBtn = false;
  public successFeedback = true;
  public showRequestsModal = false;

  public subscription: Subscription = null as unknown as Subscription;
  public eventSubscription:  Subscription = null as unknown as Subscription;

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

  ngOnDestroy(): void {
    clearInterval(this.loadingInterval)
      this.subscription.unsubscribe();
      this.eventSubscription.unsubscribe();
  }

  public async removeNotification(){
    this.socketService.emit('REMOVE_NOTIFICATION', {})
    this.showRequestsModal = false;
  }

  public acceptTournamentInvitation(){
    if(this.invitedToRoomName){
      this.invited = false;
      this.invitedBy = '';
      this.router.navigateByUrl(`/tournament/room/${this.invitedToRoomName}`);
    }
  
  }

  public allowInvitationRoute(): boolean{
    const blockRoutes = ['play', 'room'];
    let allow = true;
    blockRoutes.forEach(route =>{
      if(location.href.includes(route)){
        allow = false;
      }
    })
    return allow;

  }

  ngOnInit(){
    if(window.innerHeight > 650){
      this.centerContent = true;
    }
    this.RECEIVED_DATA.subscribe(data =>{
      this.RECEICED_TEMP = data;
    })
    this.spinner = true;
    setTimeout(()=>{
      if (!localStorage.getItem('access')){
        this.spinner = false;
      }
    }, 1000);
    this.router.events.pipe(
      filter(events => events instanceof NavigationEnd),
      map(evt => this.activatedRoute),
      map(route => {
          while (route.firstChild) {
              route = route.firstChild;
          }
          return route;
      }))
      .pipe(
          filter(route => route.outlet === 'primary'),
          mergeMap(route => route.data)
      ).subscribe(x => {
          x['showNavigation'] === true ? this.showNavigation = true : this.showNavigation = false;
      })

    this.socketService.socketData.subscribe((data: SocketResponse) =>{
      if (data && data.event === 'TOURNAMENT_INVITATION') {
        if(data.user_id !== this.user._id){
          this.invitedToRoomName = data.roomName;
          this.invited = true;
          this.invitedBy = data.userName;
        }
        
      }
      if (data && data.event === 'ONLINE_USERS_COUNT') {
        if (data.user_id !== this.user._id) {
          this.invitedToRoomName = data.roomName;
          this.invited = true;
          this.invitedBy = data.userName;
        }
      }
      if (data && data.event === 'REFRESH_USER') {
        this.config.user = data.data;
      }

      if (data && data.event === 'AUTOLOGIN_AVAILABLE') {
          if (localStorage.getItem('access')) {
              this.autologinReceived = true;
              this.loadingPercent = 50;
              this.config.attemptAutoLogin();
          }else{
            this.spinner = false;
          }
      }
      if (data && data.event === 'GET_DAILY_REWARD') {
        this.animateReward(data.tickets, data.data);
    }
      if (data && data.event === 'AUTOLOGIN') {
          this.config.user = data.data;
          this.config.isRoot = data.data.roles.some((role: any) => role === 'ADMIN');
          this.config.logged = true;
          this.spinner = false;
          this.socketService.emit('SAVE_SOCKET', { user_id: data.data._id });
          this.router.navigateByUrl('/profile')
      }
      if (data && data.event === 'AUTOLOGINFAILED') {
         localStorage.clear();
         this.spinner = false;
         this.router.navigateByUrl('/login')  
      }
    })
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
        if (user.requestNotification){
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

    if(this._initRedirect && !location.href.includes('privacy-and-terms')){
      this._initRedirect = false;
      this.router.navigateByUrl('');
      return;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.device = getConfiguration()
      console.log(this.device)
    }, 250)
  }

  public async checkFriendRequests(){
    this.socketService.emit('REMOVE_NOTIFICATION', {})
    this.showRequestsModal = false;
    this.router.navigate(['/friends', 'zahtevi']);
  }

  public async saveName(){
    if(this.newName === ''){
      return;
    }
    const settings: Settings = {
      name: this.newName,
      image: null
    }
    this.socketService.emit('UPDATE_SETTINGS', {settings})
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
    this.socketService.emit('REFRESH_USER', {})
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
    this.socketService.emit('GET_DAILY_REWARD', {})
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
    // this.subscription.unsubscribe()
    this.config.logout();
  }

  private _initRedirect = true;
}
