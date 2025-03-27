import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { EVENTS } from '../events';
import { filter, first, map, switchMap, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Friend } from '../frinds/types';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-frind-requests',
  imports: [CommonModule],
  templateUrl: './frind-requests.component.html',
  styleUrl: './frind-requests.component.scss'
})
export class FrindRequestsComponent implements OnInit, OnDestroy{
  socketService = inject(SocketService);
  private _requests$ = new BehaviorSubject<Friend[]>([])
  private _refresh$ = new BehaviorSubject<any>('data');

  subscription: Subscription;
  refreshSubscription: Subscription;

  requests$ = this._requests$.asObservable();

  ngOnInit(): void {
    this.socketService.sendMessage({event: EVENTS.GET_FRIEND_REQUESTS});

    this.subscription = this.socketService.messages$.pipe(
          filter(data => data.event === EVENTS.GET_FRIEND_REQUESTS),
          map(data => data.data)
        ).subscribe(d => {
          this._requests$.next(d)
        });

   this.refreshSubscription =  this.socketService.messages$.pipe(
      filter(data => data.event === EVENTS.ACCEPT_FRIEND),
    ).subscribe(_ => {
      this.socketService.sendMessage({event: EVENTS.GET_FRIEND_REQUESTS})
    })
  }

  acceptRequest(friend: Friend) {
    this.socketService.user$.pipe(take(1)).subscribe(user => {
      this.socketService.sendMessage({
        event: EVENTS.ACCEPT_FRIEND,
        friend_id: friend._id,
        user_id: user._id
      })
      this._refresh$.next('data1')
    })

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.refreshSubscription.unsubscribe();
  }

}
