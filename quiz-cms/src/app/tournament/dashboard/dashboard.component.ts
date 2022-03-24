import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Configuration, User } from 'src/app/shared/config.service';
import { SocketService } from 'src/app/socket-service';
import { TournamentService } from '../tournament.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              private config: Configuration,
              private tournamentService: TournamentService,
              private socketService: SocketService) { }
  get user() { return this.config.user.getValue() as User}
  
  get room() { return this.tournamentService.room }
  set room(value) { this.tournamentService.room = value }

  public clicked = false;
  public roomInput = false;
  public enterRoom = '';
  public centerLogin = false;
  public buttonReady = false;

  ngOnInit(): void {
    if(window.innerHeight > 650){
      this.centerLogin = true;
    }
    this.subscription = this.socketService.socketData.subscribe((data: any) =>{
      if(data && data.event === 'ROOM_CREATED' && data.success){
        this.room = data.roomName
        setTimeout(()=>{
          this.router.navigateByUrl(`/tournament/room/${data.roomName}`);
        },10)
       
      }
      if (data && data.event === 'LEAVE_ONE_ON_ONE') {
         this.buttonReady = true;
      }
    })
      this.socketService.emit('LEAVE_ONE_ON_ONE', { user_id: this.user._id })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize')
  checkCenterLogin(){
    if(window.innerHeight > 800){
      this.centerLogin = true;
    }
  }

  public onClick(path: string){
    this.router.navigate([`/${path}`]);
  }

  public createRoom(){
    this.socketService.emit('CREATE_ROOM', {user_id: this.user._id})
  }

  public joinRoom(){
    this.router.navigateByUrl(`/tournament/room/${this.enterRoom}`);
  }

  public goToOneOnOneRoom(){
    this.router.navigateByUrl('/tournament/one-on-one');
  }

  private subscription: Subscription = null as unknown as Subscription;

}
