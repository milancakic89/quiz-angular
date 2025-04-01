import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { RoomService } from '../room/model/room.service';
import { EVENTS } from '../events';
import { debounceTime, filter, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-gameplay',
  imports: [],
  templateUrl: './gameplay.component.html',
  styleUrl: './gameplay.component.scss'
})
export class GameplayComponent implements OnInit, OnDestroy {
  socketService = inject(SocketService);
  roomService = inject(RoomService);

  roomName = '';

  roomId$ = this.roomService.roomId$;

  tournamentFinished = false;

  statusSubscription: Subscription;
  questionLetterSubscription: Subscription;
  everyoneAnsweredSubscription: Subscription;

  ngOnInit(): void {
    this.roomId$.subscribe(roomId => {
      this.roomName = roomId;
      this.socketService.sendMessage({
        event: EVENTS.GET_ROOM_QUESTION,
        roomName: roomId
      })
    });

    this.statusSubscription = this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.TOURNAMENT_FINISHED))
      .subscribe(_ => {
        this.tournamentFinished = true;
      })

    this.statusSubscription = this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.UPDATE_WAITING_STATUS), tap(console.log)).subscribe()

    this.questionLetterSubscription = this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.SELECTED_QUESTION_LETTER), tap(console.log)).subscribe()

    this.everyoneAnsweredSubscription = this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.EVERYONE_ANSWERED))
      .pipe(
        debounceTime(500),
        filter(() => !this.tournamentFinished)
    )
      .subscribe(
        _ => {
          this.socketService.sendMessage({
            event: EVENTS.GET_ROOM_QUESTION,
            roomName: this.roomName
          })
        }
      )
  }

  ngOnDestroy(): void {
    this.roomService.setUserPlaying(false);
    this.statusSubscription.unsubscribe();
    this.questionLetterSubscription.unsubscribe();
    this.everyoneAnsweredSubscription.unsubscribe();
  }

  selectLetter() {
    this.socketService.sendMessage({
      event: EVENTS.SELECTED_QUESTION_LETTER,
      roomName: this.roomName,
      user_id: this.socketService.myId,
      letter: 'D'
    })
  }
}
