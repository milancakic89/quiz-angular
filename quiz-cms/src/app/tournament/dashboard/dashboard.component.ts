import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration, User } from 'src/app/shared/config.service';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router,
              private config: Configuration,
              private socketService: SocketService) { }
  get user() { return this.config.user.getValue() as User}            

  public clicked = false;
  public roomInput = false;
  public room = '';

  ngOnInit(): void {
    this.socketService.socketData.subscribe((data: any) =>{
      if(data && data.event === 'ROOM_CREATED' && data.success){
        this.router.navigateByUrl(`/tournament/room/${data.roomName}`);
      }
    })
  }

  public onClick(path: string){
    // this.router.navigate([`/${path}`]);
  }

  public createRoom(){
    this.socketService.emit('CREATE-ROOM', {user_id: this.user._id})
  }

  public joinRoom(){
    this.router.navigateByUrl(`/tournament/room/${this.room}`);
  }

}
