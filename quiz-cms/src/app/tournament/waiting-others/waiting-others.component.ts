import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'app-waiting-others',
  templateUrl: './waiting-others.component.html',
  styleUrls: ['./waiting-others.component.scss']
})
export class WaitingOthersComponent implements OnInit {

  public finished: any = [1,2,3];
  public awaitingUsers: any = [1,2,3,4,5,6,7];
  public allAnswered = false;
  public allUsers = [];

  constructor(private router: Router, private route: ActivatedRoute, private socket: SocketService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      if(params['room']){
        this._room = params['room'];
        this.socket.emit('LOAD-ROOM-USERS', {})
      }
    });

    this.socket.socketData.subscribe(data =>{
      this.allUsers = data.users;
      this.finished = data.users.filter((user: any) => user.finished === true);
      this.awaitingUsers = data.users.filter((user: any) => user.finished !== true);
    })
  }

  public onNextRound(){
    this.router.navigateByUrl(`/tournament/play/${this._room}/1`);
  }

  private _room = '';

}
