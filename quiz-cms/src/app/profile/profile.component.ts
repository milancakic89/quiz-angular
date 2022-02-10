import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { FeedbackMessageService } from '../feedback.service';
import { PlayService } from '../play/play.service';
import { Configuration, User } from '../shared/config.service';
import { SocketService } from '../socket-service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  constructor(private config: Configuration,
              private router: Router,
              private appService: AppService,
              private socketService: SocketService,
              private feedbackService: FeedbackMessageService,
              private playService: PlayService,
              private service: ProfileService) { }

  get isRoot(){return this.config.isRoot}

  public showContributionInfo = false;
  public imageUrl = 'https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.0/img/avatar.png';

  public showInput = false;
  public user = null as any as User;

  public clicked = false;

  public gameLeaved = false;
  public liveCounterMinutes = 0;

  public name = '';
  public showNameBox = false;

  public achievementNotification = false;


  public onChangeAvatar(){
    localStorage.setItem('avatar', this.imageUrl);
    this.showInput = false;
  }

  ngAfterViewInit(): void {
    
    // document.body.requestFullscreen()
    //   .then(function () {
    //     // element has entered fullscreen mode successfully
    //   })
    //   .catch(function (error) {
    //     console.log(error.message);
    //   });
  }

  ngOnInit(): void {
    this.playService.allowBackButton = true;
    this.imageUrl = localStorage.getItem('avatar') || '';
    this.clicked = false;
    this.load();
  }

  public async load(){
    const { data, success } = await this.config.refreshUser()
    if(success){
      this.user = data;
      this.config.user.next(data);
      if(Date.now() >= data.daily_price){
        this.feedbackService.DailyPrice.emit(true);
      }
      if (this.user.notifications.achievements) {
        this.achievementNotification = true;
      }
      if (data.playing) {
        this.gameLeaved = true;
        setTimeout(() => {
          this.gameLeaved = false;
          this.resetPlayingState();
        }, 3000)
      }
      if (this.user.lives === 0) {
        this.onResetLives();
      }
     

    }
  }

  public cleanEmptyRooms(){
    this.socketService.emit('CLEAN_THE_EMPTY_ROOMS', {})
  }

  public hideAchievementNotification(){
    this.achievementNotification = false;
  }

  public async resetPlayingState(){
    const { success } = await this.playService.resetPlayingState();
    if(success){
      this.reduceOneLife();
    }
  }

  public closeNameBox(){
    setTimeout(()=>{
      this.showNameBox = false
    }, 10)
  }

  public async updateName(){
    if(!this.name.length){
      return;
    }
    const { success } = await this.service.updateName(this.name);
    if(success){
      this.user.name = this.name;
    }
    this.closeNameBox()
  }

  public async onResetLives(){
    const { data, success } = await this.service.resetLives()
    if(success){
      this.config.user.next(data);
    }
  }

  public async reduceOneLife() {
    const { data, success } = await this.playService.reduceOneLife()
    if (success) {
      this.user = data;
      this.config.user.next(data);
    }
  }

  // public calculateResetTime(timeInMs: number){
  //   const minutes = this.service.calculateResetTime(timeInMs)
  //   this.liveCounterMinutes = minutes;
  //   this.appService.livesReset.next(minutes)  
  // }

  public onClick(path: string){
    this.clicked = true;
    setTimeout(()=>{
      this.router.navigateByUrl(path)
    }, 500)
  }

  public logout(){
    this.config.logged = false;
    this.playService.allowBackButton = true;
    localStorage.clear();
    setTimeout(()=>{
      this.router.navigateByUrl('/login')
    }, 50)
    
  }

}
