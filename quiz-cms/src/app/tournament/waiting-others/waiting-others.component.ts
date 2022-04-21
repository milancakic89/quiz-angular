import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayService } from 'src/app/play/play.service';
import { Configuration, User } from 'src/app/shared/config.service';
import { SocketService } from 'src/app/socket-service';
import { TournamentService } from '../tournament.service';

@Component({
  selector: 'app-waiting-others',
  templateUrl: './waiting-others.component.html',
  styleUrls: ['./waiting-others.component.scss']
})
export class WaitingOthersComponent implements OnInit, OnDestroy {


  constructor(private router: Router, 
    private route: ActivatedRoute,
    private config: Configuration,
    private tournamentService: TournamentService,
    private playService: PlayService,
    private socket: SocketService) { }

  get user() { return this.config.user.getValue()}

  get room() { return this.tournamentService.room }
  set room(value) { this.tournamentService.room = value }

  public results: any = [];

  public subscription: Subscription = null as unknown as Subscription;

  ngOnDestroy(): void {
      if(this.subscription){
        this.subscription.unsubscribe();
      }
  }

  ngOnInit(): void {
    this.playService.allowBackButton = false;
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.socket.emit('GET_ROOM_RESULTS', { roomName: params['id'], user_id: this.user._id });
       
      }
    });

  this.subscription = this.socket.socketData.subscribe(data =>{
    if (data && data.event === 'GET_ROOM_RESULTS'){
      this.results = data.users.sort((userA: User, userB: User) => {
        if(userA.score > userB.score){
          return -1;
        }else if(userB.score > userA.score){
          return 1;
        }else{
          return 0;
        }

      });
      this.socket.emit('LEAVE_ROOM', {roomName: this.room, user_id: this.user._id})
    
    }
  })
  }

  public onFinish(){
    this.playService.allowBackButton = true;
    this.tournamentService.room = '';
    setTimeout(()=>{
      this.router.navigateByUrl('/profile')
    }, 100)
  }

  public onFinishTest() {
    this.playService.allowBackButton = true;
    this.socket.emit('LEAVE_ROOM', {roomName: this.room, user_id: this.user._id});
    setTimeout(()=>{
      this.tournamentService.room = '';
      this.router.navigateByUrl('/profile')
    }, 200)
  }

  public onNextRound(){
  }

 

}
