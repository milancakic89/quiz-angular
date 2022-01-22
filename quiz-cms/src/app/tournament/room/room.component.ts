import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Configuration, User } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocketService } from 'src/app/socket-service';

interface RoomUser{
  name: string;
  id: string;
  avatar: string;
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, 
              private socket: SocketService,
              private notification: NotificationService,
              private config: Configuration,
              private router: Router) { }

  get user() { return this.config.user.getValue() as User }

  public room = '';
  public roomUsers: RoomUser[] = [];
  public tableReady = false;

  ngOnInit(): void {
    setTimeout(() =>{
      this.tableReady = true;
    }, 300)
    this.route.params.subscribe(params =>{
      if(params['id']){
        this.room = params['id'];
        this.socket.emit('JOIN-ROOM', {
          roomName: this.room,
          name: this.user.name ,
          user_id: this.user._id,
          avatar: this.user.avatar_url
        }
          )
      }else{
        this.router.navigateByUrl('/play');
      }
    })

    this.socket.socketData.subscribe((data: any) =>{
      if(data && data.event === 'JOINED-ROOM'){
        this.roomUsers = data.users;
      }

      if(data && data.event === 'LEAVED-ROOM'){
        this.roomUsers = data.users;
      }

      if(data && data.event === 'ROOM-DONT-EXIST'){
        console.log('room dont exist')
        this.notification.notification.emit({ success: false, message: 'Turnir nije pronadjen' })
        this.router.navigateByUrl(`/play`);
      }

      //ROOM-DONT-EXIST
    })
  }

  ngOnDestroy(): void {
    this.tableReady = false;
    this.socket.emit('LEAVE-ROOM', {user_id: this.user._id, roomName: this.room})
  }

}
