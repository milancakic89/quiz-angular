import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayService } from 'src/app/play/play.service';
import { Configuration } from 'src/app/shared/config.service';
import { SocketService } from 'src/app/socket-service';
import { TournamentService } from '../tournament.service';

@Component({
  selector: 'app-waiting-others',
  templateUrl: './waiting-others.component.html',
  styleUrls: ['./waiting-others.component.scss']
})
export class WaitingOthersComponent implements OnInit {


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

  ngOnInit(): void {
    this.playService.allowBackButton = false;
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.socket.emit('GET_ROOM_RESULTS', { roomName: this.room, user_id: this.user._id });
       
      }
    });

  this.socket.socketData.subscribe(data =>{
    if (data && data.event === 'GET_ROOM_RESULTS'){
      this.results = data.users;
      this.socket.emit('LEAVE-ROOM', {roomName: this.room})
    
    }
  })
  }

  public onFinish(){
    this.playService.allowBackButton = true;
    this.tournamentService.room = '';
    setTimeout(()=>{
      location.href = 'https://kviz-live.web.app';
    }, 100)
  }

  public onFinishTest() {
    this.playService.allowBackButton = true;
    this.socket.emit('LEAVE-ROOM', {roomName: this.room});
    setTimeout(()=>{
      this.tournamentService.room = '';
      this.router.navigateByUrl('/profile')
    }, 200)
  }

  public onNextRound(){
  }

 

}
