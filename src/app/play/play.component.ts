import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { EVENTS } from '../events';
import { distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
import { Room } from '../types';
import { Router } from '@angular/router';
import { RoomService } from '../room/model/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-play',
  imports: [],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements AfterViewInit, OnDestroy{
  socketService = inject(SocketService);
  roomService = inject(RoomService)
  router = inject(Router)

  routerSubscription: Subscription;


  ngAfterViewInit(): void {
   this.routerSubscription = this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.ROOM_CREATED),
      take(1),
    ).subscribe((room: any) => {
      this.roomService.setRoomId(room.roomName);
      this.roomService.setRoomAndOwner({
        room: room.roomName,
        owner_id: this.socketService.myId
      })
      this.router.navigate(['/dashboard','room', room.roomName]);
    })
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }


  createTournament(){
    this.socketService.sendMessage({
      event: EVENTS.CREATE_ROOM
    })
  }
}
