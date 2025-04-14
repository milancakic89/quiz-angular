import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../socket.service';
import { debounceTime, filter, take, tap } from 'rxjs/operators';
import { EVENTS } from '../../events';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Friend } from '../../friends/types';
import { RoomService } from '../../room/model/room.service';
import { Router } from '@angular/router';

type OponentResponse = 'ACCEPTED' | 'DECLINED' | 'NULL';

@Component({
  selector: 'app-one-on-one',
  imports: [CommonModule],
  templateUrl: './one-on-one.component.html',
  styleUrl: './one-on-one.component.scss'
})
export class OneOnOneComponent implements OnInit, OnDestroy{
  socketService = inject(SocketService);
  roomService = inject(RoomService);
  router = inject(Router)

  private _oponent$ = new BehaviorSubject<Friend | null>(null);
  private _match$ = new BehaviorSubject(null);
  private _oponentResponse$ = new BehaviorSubject<OponentResponse>('NULL')

  match$ = this._match$.asObservable().pipe(tap(console.log));

  oponent$ = this._oponent$.asObservable()

  user$ = this.socketService.user$;

  matchRoom = '';

  oponentDeclined$ = this._oponentResponse$.asObservable()

  joinSubscription: Subscription;
  declineSubscription: Subscription;
  acceptSubscription: Subscription;

  ngOnInit(): void {
    this.joinOneOnOne()

    this.joinSubscription = this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.MATCH_FOUND),
      debounceTime(2000),
    ).subscribe(data => {
      this._match$.next(data.data);
      this._oponent$.next(data.data.oponent)
    })

    this.declineSubscription = this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.OPONENT_DECLINED),
    ).subscribe(data => {
      this._oponentResponse$.next('DECLINED');
      setTimeout(() => {
        this._oponentResponse$.next('NULL');
        this._match$.next(null);
        this._oponent$.next(null);
        this.joinOneOnOne();
      }, 2000)
    });

    this.acceptSubscription = this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.OPONENT_ACCEPTED),
    ).subscribe(data => {
      this._oponentResponse$.next('ACCEPTED');
    })

    this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.BOTH_ACCEPTED),
      take(1),
    ).subscribe(data => {
      setTimeout(() => {
        this.startGame()
      }, 500)
    });

    this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.TOURNAMENT_STARTING)
    ).subscribe(_ => {
      this.router.navigate(['dashboard','game']);
    })


  }
  ngOnDestroy(): void {
    this.acceptSubscription.unsubscribe();
    this.declineSubscription.unsubscribe()
    this.joinSubscription.unsubscribe()
    this.roomService.setHideNavbar(false);
  }

  startGame(){
    this.match$.subscribe(match => {
      this.roomService.setIsOneOnOne(true);
      this.roomService.setRoomId(match.roomName);
      this.roomService.setHideNavbar(true)
      this.socketService.sendMessage({
        event: EVENTS.START_TOURNAMENT,
        roomName: match.roomName,
        match: true,
        amountOfQuestions: 15
      })
    })

  }

  joinOneOnOne(){
    this.socketService.user$.pipe(take(1)).subscribe(user => {
      this.socketService.sendMessage({
        event: EVENTS.JOIN_ONE_ON_ONE,
        ...user
      })
    })
  }

  declineOponent(){
    this.match$.pipe(take(1)).subscribe(match => {
      this.socketService.sendMessage({
        event: EVENTS.OPONENT_DECLINED,
        roomName: match.roomName,
        oponentID: match.oponent._id
      });
      setTimeout(() => {
        this.router.navigateByUrl('/dashboard/play')
      }, 200)
     
    })

  }

  acceptOponent(){
    this.match$.pipe(take(1)).subscribe(match => {
      this.socketService.sendMessage({
        event: EVENTS.OPONENT_ACCEPTED,
        roomName: match.roomName,
        oponentID: match.oponent._id
      });
     
    })
  }

}
