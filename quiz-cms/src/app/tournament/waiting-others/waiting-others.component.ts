import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayService } from 'src/app/play/play.service';
import { Configuration } from 'src/app/shared/config.service';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'app-waiting-others',
  templateUrl: './waiting-others.component.html',
  styleUrls: ['./waiting-others.component.scss']
})
export class WaitingOthersComponent implements OnInit {


  constructor(private router: Router, 
    private route: ActivatedRoute,
    private config: Configuration,
    private playService: PlayService,
    private socket: SocketService) { }

  get user() { return this.config.user.getValue()}

  public room = '';
  public results: any = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.room = params['id'];
        this.socket.emit('GET_ROOM_RESULTS', { roomName: this.room, user_id: this.user._id });
      }
    });

  this.socket.socketData.subscribe(data =>{
    if (data && data.event === 'GET_ROOM_RESULTS'){
      this.results = data.users;
    }
  })
  }

  public onFinish(){
    this.playService.allowBackButton = true;
    setTimeout(()=>{
      this.router.navigateByUrl('/profile')
    }, 100)
  }

  public onNextRound(){
  }

 

}
