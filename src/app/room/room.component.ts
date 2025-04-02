import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoomService } from './model/room.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter, map, startWith, take, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SocketService } from '../socket.service';
import { EVENTS } from '../events';
import { Friend } from '../friends/types';
import { UserItemComponent } from "../shared/components/user-item/user-item.component";

@Component({
  selector: 'app-room',
  imports: [CommonModule, RouterModule, UserItemComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent implements OnInit, OnDestroy{
  private _paramRoom$ = new BehaviorSubject<string>('');
  private _roomId = '';

  route = inject(ActivatedRoute);
  router = inject(Router);
  roomService = inject(RoomService);
  socketService = inject(SocketService);

  myself = this.socketService.myselfUsername;
  user$ = this.socketService.user$

  roomCreatedByMyself$ = this.roomService.roomAndOwner$.pipe(
    map(roomAndOwner => roomAndOwner.owner_id === this.socketService.myId && roomAndOwner.room === this._roomId),
  )


  allowRoom = combineLatest([this.roomService.roomId$.pipe(filter(Boolean)), this._paramRoom$.pipe(filter(Boolean))]).pipe(
    take(1),
    map(([allowId, paramId]) => {
      return allowId === paramId;
    })
  );

  roomUsers$ = this.socketService.messages$.pipe(
    filter(socketEvent => socketEvent.event === EVENTS.JOINED_ROOM),
    map((event: any) => {
      return event.users.reduce((acc, curr) => {
        if(!acc.find(usr => usr._id === curr._id)){
          acc.push({
            ...curr,
            online: true
          });
        }
        return acc;
      }, [])
    }),
    startWith([])
  )

  allFriends$ = this.socketService.messages$.pipe(
    filter(event => event.event === EVENTS.GET_FRIEND_LIST),
    map(eventData => eventData.data),
    map((friends: Friend[]) => {
      return friends.filter(i => i.online && i._id !== this.socketService.myId)
    })
  )

  friends$ = combineLatest([this.roomUsers$, this.allFriends$]).pipe(
    map(([joined, allFriends]) => {
      const friends = allFriends.filter(item => {
        return joined.every(user => user._id !== item._id);
      });
      return friends;
    })
  )

  canDeactivate(){
    let playing = false;
    this.roomService.userPlaying$.subscribe(isPlaying => {
      playing = isPlaying;
    })
    return playing;
  }

  ngOnInit(): void {
    //TODO: ADD SUBSCRIPTIONS
    this.socketService.clearMessageChanel();
    this.roomService.setUserPlaying(true);
    this.route.params.pipe(take(1)).subscribe(params => {
      if(params['room_id']){
        this._paramRoom$.next(params['room_id']);
        this._roomId = params['room_id'];
      }
    });

    this.socketService.sendMessage({
      event: EVENTS.JOIN_ROOM,
      roomName: this._roomId,
      user_id: this.socketService.myId
    })

    this.socketService.sendMessage({
      event: EVENTS.GET_FRIEND_LIST
    });

    this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.TOURNAMENT_STARTING)
    ).subscribe(_ => {
      this.roomService.setHideNavbar(true);
      this.router.navigate(['dashboard','game']);
    })
  }

  ngOnDestroy(): void {
    this.roomService.setUserPlaying(false);
    this.socketService.sendMessage({
      event: EVENTS.CLEAN_THE_EMPTY_ROOMS
    })
  }

  startTournament(){
    this.socketService.sendMessage({
      event: EVENTS.START_TOURNAMENT,
      roomName: this._roomId,
      amountOfQuestions: 2
    })
  }

  refresh(){
    this.socketService.sendMessage({
      event: EVENTS.GET_FRIEND_LIST
    })
  }

  invite(friend: Friend){
    this.socketService.sendMessage({
      event: EVENTS.INVITE_FRIENDS,
      friends: [friend],
      roomName: this._roomId,
      userName: this.myself
    })
  }

  onGoBack(el: any){
    this.router.navigateByUrl('/')
  }
}
