import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { EVENTS } from '../events';
import { debounceTime, filter, map, shareReplay, take, withLatestFrom } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { Friend } from './types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-frinds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './frinds.component.html',
  styleUrl: './frinds.component.scss',
})
export class FrindsComponent implements OnInit, OnDestroy {
  search$ = new BehaviorSubject<string>('');
  socketService = inject(SocketService);

  search = '';

  onlineCountSubscription: Subscription;
  removeSubscription: Subscription;

  allUsers$: Observable<Friend[]> = combineLatest([this.socketService.messages$, this.socketService.user$]).pipe(
    filter(([event, _]) => event.event === EVENTS.GET_ALL_USERS),
    map(([allUsers, myself]) => [...allUsers.data as Friend[]].filter(usr => usr._id !== myself._id)),
    shareReplay())

  friends$: Observable<Friend[]> = combineLatest([this.socketService.messages$, this.socketService.user$]).pipe(
    filter(([event, _]) => event.event === EVENTS.GET_FRIEND_LIST),
    map(([friendsEvent, myself]) => [...friendsEvent.data as Friend[]].filter(usr => usr._id !== myself._id)),
    shareReplay()
  )

  searchFriendsList$ = combineLatest([this.allUsers$, this.friends$]).pipe(
    map(([allUsers, friends]) => {
      const users = allUsers.filter(user => {
        return friends.every(friend => user._id !== friend._id)
      })
      return users;
    })
  )

  sendRequest(person: Friend) {
    this.socketService.user$.pipe(filter(Boolean), take(1)).subscribe(user => {
      this.socketService.sendMessage({
        event: EVENTS.ADD_FRIEND,
        friend_id: person._id,
        user_id: user._id
      })
    })
  }

  removeFriend(friend: Friend){
    this.socketService.sendMessage({
      event: EVENTS.REMOVE_FRIEND,
      remove_id: friend._id
    })
  }

  ngOnInit(): void {
    this.search$.pipe(debounceTime(400)).subscribe(search => {
      this.socketService.sendMessage({ event: EVENTS.GET_ALL_USERS, query: search })
    })
    this.socketService.sendMessage({
      event: EVENTS.GET_FRIEND_LIST
    });

    this.onlineCountSubscription = this.socketService.messages$.pipe(
      filter(socketEvent => socketEvent.event === EVENTS.USER_CONNECTED || socketEvent.event === EVENTS.USER_DISCONECTED)
    ).subscribe(_ => {
      this.socketService.sendMessage({
        event: EVENTS.GET_FRIEND_LIST
      })
    });

    this.removeSubscription = this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.REMOVE_FRIEND)).subscribe(
      _ => this.socketService.sendMessage({
        event: EVENTS.GET_FRIEND_LIST
      })
    )
  }

  ngOnDestroy(): void {
    this.onlineCountSubscription.unsubscribe();
    this.removeSubscription.unsubscribe();
  }
}
