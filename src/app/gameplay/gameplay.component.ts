import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { RoomService } from '../room/model/room.service';
import { EVENTS } from '../events';
import { BehaviorSubject, combineLatest, debounceTime, filter, map, Observable, shareReplay, Subscription, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Question } from '../types';
import { UserItemComponent } from "../shared/components/user-item/user-item.component";

type CheckCorrect = 'CORRECT' | 'WRONG' | 'NULL';

@Component({
  selector: 'app-gameplay',
  imports: [CommonModule, RouterModule, UserItemComponent],
  templateUrl: './gameplay.component.html',
  styleUrl: './gameplay.component.scss',
  standalone: true
})
export class GameplayComponent implements OnInit, OnDestroy {
  socketService = inject(SocketService);
  roomService = inject(RoomService);
  router = inject(Router);

  private _question$ = new BehaviorSubject(null);
  private _disableBtn$ = new BehaviorSubject(false);
  private _correct$ = new BehaviorSubject<CheckCorrect>('NULL');
  private _selectedLetter$ = new BehaviorSubject(null);
  private _counter$ = new BehaviorSubject(15);
  private _showResult$ = new BehaviorSubject(false);
  private _results$ = new BehaviorSubject([]);
  candeactivate = false;

  isOneOnOne = false;

  disableBtn$ = this._disableBtn$.asObservable()
  correct$ = this._correct$.asObservable();
  selectedLetter$ = this._selectedLetter$.asObservable();
  showResult$ = this._showResult$.asObservable();
  results$ = this._results$.asObservable().pipe(tap(console.log));

  counter$ = this._counter$.asObservable().pipe(
    map(counter => Array(counter).fill('')),
    shareReplay(1)
  );


  question$: Observable<Question> = this._question$.asObservable().pipe(filter(Boolean))

  roomName = '';

  roomId$ = this.roomService.roomId$;

  userDisconected$ = combineLatest(
    [
      this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.UPDATE_WAITING_STATUS)),
      this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.USER_DISCONECTED))
    ]
  ).pipe(
    map(([socketData, disconectData]) => {
        const data: any = socketData as any;
        const disconected = disconectData as any;
        return data.users.some(user => user._id === disconected.user_id );
    }),
    tap(_ => {
      this.candeactivate = true;
      setTimeout(() => {
        this.router.navigateByUrl('');
      }, 5000)
    
    })
  )

  tournamentFinished = false;

  statusSubscription: Subscription;
  questionLetterSubscription: Subscription;
  questionSubscription: Subscription;
  everyoneAnsweredSubscription: Subscription;

  canDeactivate(){
    return this.candeactivate;
  }

  trackIndex(index){
    return Math.random();
  }

  ngOnInit(): void {
    this.roomService.isOneOnOneRoom$.pipe(take(1)).subscribe(oneOneOne => {
      this.isOneOnOne = oneOneOne;
    });

    this.roomService.setHideNavbar(true);
    this.roomId$.subscribe(roomId => {
      this.roomName = roomId;
      this.socketService.sendMessage({
        event: EVENTS.GET_ROOM_QUESTION,
        roomName: roomId
      })
    });

    this.statusSubscription = this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.TOURNAMENT_FINISHED))
      .subscribe(data => {
        this.candeactivate = true;
        this.tournamentFinished = true;
        this._showResult$.next(true);
      })

    this.questionSubscription = this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.GET_ROOM_QUESTION))
    .subscribe((socketData: any) => {
      this._question$.next(socketData.question);
    })

    this.statusSubscription = this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.UPDATE_WAITING_STATUS)).subscribe()

    this.questionLetterSubscription = this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.SELECTED_QUESTION_LETTER))
    .subscribe((data: any) => {
      this._correct$.next(data.correct ? 'CORRECT' : 'WRONG');
    })

    this.everyoneAnsweredSubscription = this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.EVERYONE_ANSWERED))
      .pipe(
        debounceTime(1000),
        tap((socketData: any) => this._counter$.next(socketData.counter)),
    )
      .subscribe(
        data => {
          this._results$.next(data.users)
          this._disableBtn$.next(false);
          this._correct$.next('NULL');
          const eventData: any = {
            event: EVENTS.GET_ROOM_QUESTION,
            roomName: this.roomName
          }
          if(this.isOneOnOne){
            eventData.match = true;
          };

          this.socketService.sendMessage(eventData);
        }
      )
  }

  ngOnDestroy(): void {
    this.roomService.setIsOneOnOne(false);
    this.roomService.setHideNavbar(false);
    this.roomService.setUserPlaying(false);
    this.statusSubscription.unsubscribe();
    this.questionLetterSubscription.unsubscribe();
    this.everyoneAnsweredSubscription.unsubscribe();
  }

  selectLetter(letter: string) {
    this._disableBtn$.next(true);
    this._selectedLetter$.next(letter)
    this.socketService.sendMessage({
      event: EVENTS.SELECTED_QUESTION_LETTER,
      roomName: this.roomName,
      user_id: this.socketService.myId,
      letter: letter
    })
  }
}
