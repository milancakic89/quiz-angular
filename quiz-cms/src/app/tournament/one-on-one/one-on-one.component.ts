import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
    private config: Configuration) { }
  
  get user() { return this.config.user.getValue() as User }

  public joined = false;
  public oponent: User = null as unknown as User;
  public start = false;

  ngOnInit(): void {
    this.subscription = this.socketService.socketData.subscribe((data) =>{
      if (data && data.event === 'JOIN_ROOM' ){
         console.log('joined 1 on 1 room')
         this.joined = true;
      }
      if (data && data.event === 'OPONENT_FOUND') {
        setTimeout(()=>{
          this.oponent = data.oponent;
          this.startOneOnOne();
        }, 1000)
        
      }
    })
    this.socketService.emit('JOIN_ROOM', { roomName: '1on1', user_id: this.user._id });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.socketService.emit('LEAVE_ROOM', { roomName: '1on1'})
  }

  public startOneOnOne(){
      this.start = true;
  }

  private subscription: Subscription = null as unknown as Subscription;

}
