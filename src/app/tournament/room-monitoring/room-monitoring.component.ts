import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/config.service';
import { SocketService } from 'src/app/socket-service';

interface OneOnOneRoom{
    oneOnOneUsers: User[];
    nextMatch: User[];
    onlineUsers: number;
}
@Component({
  selector: 'app-room-monitoring',
  templateUrl: './room-monitoring.component.html',
  styleUrls: ['./room-monitoring.component.scss']
})
export class RoomMonitoringComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  public oneOnOneRoom: OneOnOneRoom = {
    oneOnOneUsers: [],
    nextMatch: [],
    onlineUsers: 0
  };
  public subscription: Subscription = null as unknown as Subscription;

  ngOnInit(): void {
    this.subscription = this.socketService.socketData.subscribe(data => {
      if(data && data.event === 'TRACK_QUEUE_MANAGER'){
        this.oneOnOneRoom.nextMatch = data.data.players;
        this.oneOnOneRoom.oneOnOneUsers = data.data.queue;
        this.oneOnOneRoom.onlineUsers = 0;
        setTimeout(()=>{
          this.oneOnOneRoom = data.data;
        }, 10)
        
      }
    })
    setTimeout(() =>{
      this.socketService.socket.emit('TRACK_ONE_ON_ONE', {})
    }, 100)
  }

}
