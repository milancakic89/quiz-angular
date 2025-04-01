import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { EVENTS } from '../events';
import { filter, first, map, switchMap, take, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Friend } from '../friends/types';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { UserItemComponent } from '../shared/components/user-item/user-item.component';

@Component({
  selector: 'app-frind-requests',
  imports: [CommonModule, UserItemComponent],
  templateUrl: './frind-requests.component.html',
  styleUrl: './frind-requests.component.scss'
})
export class FrindRequestsComponent implements OnInit, OnDestroy{
  socketService = inject(SocketService);
  private _requests$ = new BehaviorSubject<Friend[]>([])
  private _refresh$ = new BehaviorSubject<any>('data');

  loading = true;

  subscription: Subscription;
  refreshSubscription: Subscription;

  requests$ = this._requests$.asObservable().pipe(tap(_ =>  console.log(this.loading)));

  ngOnInit(): void {
    this.socketService.sendMessage({event: EVENTS.GET_FRIEND_REQUESTS});

    this.subscription = this.socketService.messages$.pipe(
          filter(data => data.event === EVENTS.GET_FRIEND_REQUESTS),
          map(data => data.data)
        ).subscribe(d => {
          this._requests$.next(d);
          this.loading = false;
         
        });

   this.refreshSubscription =  this.socketService.messages$.pipe(
      filter(data => data.event === EVENTS.ACCEPT_FRIEND),
    ).subscribe(_ => {
      this.socketService.sendMessage({event: EVENTS.GET_FRIEND_REQUESTS});
      this.loading = true;
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
