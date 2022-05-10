import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { PlayService } from 'src/app/play/play.service';
import { Configuration, User } from 'src/app/shared/config.service';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'app-one-on-one',
  templateUrl: './one-on-one.component.html',
  styleUrls: ['./one-on-one.component.scss']
})
export class OneOnOneComponent implements OnInit, OnDestroy {

  constructor(
    private socketService: SocketService,
    private router: Router,
    private appService: AppService,
    private playService: PlayService,
    private config: Configuration) { }
  
  get user() { return this.config.user.getValue() as User }

  get root(){return this.config.isRoot}

  public joined = false;
  public oponent: User = null as unknown as User;
  public start = false;
  public room = '';
  public oponentAccepted = false;
  public acceptGame = false;
  public bothAccepted = false;
  public oponentDeclined = false;
  public online = 0;
  public onlineSubscription: Subscription = null as unknown as Subscription;

  ngOnInit(): void {
    this.onlineSubscription = this.appService.onlineUsers.subscribe(onlineCounter =>{
      this.online = onlineCounter;
    })
    this.subscription = this.socketService.socketData.subscribe((data) =>{
      if (data && data.event === 'JOIN_ROOM' ){
        //  this.joined = true;
      }

      if (data && data.event === 'MATCH_FOUND') {
        this.room = data.data.roomName;
        this.oponent = data.data.oponent;
        setTimeout(()=>{
          this.startOneOnOne();
        }, 1000)
        
      }
      if (data && data.event === 'OPONENT_ACCEPTED') {
        this.oponentAccepted = true;
      }
      if (data && data.event === 'BOTH_ACCEPTED') {
        this.oponentAccepted = true;
        setTimeout(()=>{
           this.bothAccepted = true;
        },300)  
       
      }
      if (data && data.event === 'OPONENT_DECLINED') {
        this.acceptGame = false;
        this.oponentDeclined = true;
      }
    })
    this.socketService.emit('JOIN_ROOM', { roomName: '1on1', user_id: this.user._id, avatar_url: this.user.avatar_url, score: this.user.score });
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
   
  }

  public startOneOnOne(){
    this.joined = true;
      setTimeout(()=>{
        this.start = true;
      }, 1000)
  }

  public onAccept(){
    this.acceptGame = true;
    this.socketService.emit('OPONENT_ACCEPTED', { oponentID: this.oponent._id, roomName: this.room});
  }

  public onDecline() {
    this.socketService.emit('OPONENT_DECLINED', { oponentID: this.oponent._id, roomName: this.room });
    this.acceptGame = false;
    this.joined = false;
    setTimeout(() => {
      this.socketService.emit('JOIN_ROOM', { roomName: '1on1', score: this.user.score, user_id: this.user._id, avatar_url: this.user.avatar_url });
    }, 100);
   
  }

  public onKeepSearching(){
    this.oponentDeclined = false;
    this.joined = false;
    this.acceptGame = false;
    this.oponent = null as unknown as User;
    this.socketService.emit('JOIN_ROOM', { roomName: '1on1', score: this.user.score , user_id: this.user._id, avatar_url: this.user.avatar_url });
  }

  public onExit(){
    this.socketService.emit('OPONENT_DECLINED', { oponentID: this.oponent._id, roomName: this.room });
    this.oponentDeclined = false;
    this.joined = false;
    this.acceptGame = false;
    this.router.navigateByUrl('/tournament');  
  }

  public tournamentFinish($event: any){
    this.playService.allowBackButton = true;
    setTimeout(()=>{
      
        this.router.navigateByUrl(`/tournament/room/${this.room}/results`)
    },300)
  }

  private subscription: Subscription = null as unknown as Subscription;
  private _acceptOponnent = false;

}
