import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FriendsService } from 'src/app/friends/friends.service';
import { PlayService } from 'src/app/play/play.service';
import { Configuration, User } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocketService } from 'src/app/socket-service';
import { TournamentService } from '../tournament.service';

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
              private playService: PlayService,
              private friendsService: FriendsService,
              private tournamentService: TournamentService,
              private notification: NotificationService,
              private config: Configuration,
              private router: Router) { }

  get user() { return this.config.user.getValue() as User }
  get root() { return this.user._id === this.createdBy}

  get room() { return this.tournamentService.room}
  set room(value){ this.tournamentService.room = value}

  public roomUsers: RoomUser[] = [];
  public friends: User[] = [];
  public tableReady = false;
  public createdBy = '';
  public friendListPopup = false;

  public subscription: Subscription = null as any;

  ngOnInit(): void {
    setTimeout(() =>{
      this.tableReady = true;
    }, 300)
    this.route.params.subscribe(params =>{
      if(params['id']){
        this.room = params['id'];
        localStorage.setItem('room', params['id'])
        this.socket.emit('JOIN_ROOM', {
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

    this.subscription = this.socket.socketData.subscribe((data: any) =>{
      if(data && data.event === 'JOINED_ROOM'){
        this.roomUsers = data.users;
        this.createdBy = data.created_by;
      }

      if(data && data.event === 'LEAVED_ROOM'){
        this.roomUsers = data.users;
      }

      if(data && data.event === 'TOURNAMENT_STARTING'){
        this.router.navigate([`/tournament/room/${this.room}/play`]);
      }

      if(data && data.event === 'ROOM_DONT_EXIST'){
        this.playService.allowBackButton = true;
        this.notification.notification.emit({ success: false, message: 'Turnir nije pronadjen: => ' + data.fn  })
        this.router.navigateByUrl(`/play`);
      }

      

      //ROOM_DONT_EXIST
    })
  }

  public openFriendList(){
    this.friendListPopup = true;
    this.getFriendsList();
  }

  public closeFriendList(){
    this.friendListPopup = false;
  }

  public onFriendSelectChange($event: boolean, friend: User){
      friend.selected = $event;
      console.log(this.friends)
  }

  public onFriendInvite(){
    const inviteFriends = this.friends.filter(friend => friend.selected === true);
    this.socket.emit('INVITE_FRIENDS', { friends: inviteFriends, roomName: this.room});
  }

  public startTournament(){
    this.socket.emit('START_TOURNAMENT', {roomName: this.room})
  }

  public isButtonEnabled(){
    return this.friends.some(friend => friend.selected === true);
  }

  public async getFriendsList(){
    const { data, success } = await this.friendsService.getFriendsList();
    if (success) {
      this.friends = data;
      // this.friends = data.filter(user => user.online === true);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.tableReady = false;
  }

}
