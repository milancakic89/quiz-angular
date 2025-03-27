import { Component, inject, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { EVENTS } from '../events';
import { debounceTime, filter, map, shareReplay, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Friend } from './types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-frinds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './frinds.component.html',
  styleUrl: './frinds.component.scss',
})
export class FrindsComponent implements OnInit{
  search$ = new BehaviorSubject<string>('');
  socketService = inject(SocketService);

  search = '';



  allUsers$: Observable<Friend[]> = this.socketService.messages$
    .pipe(
      filter(e => e.event === EVENTS.GET_ALL_USERS),
      map(data => data.data));

          
  friends$: Observable<Friend[]> = this.socketService.messages$.pipe(
    filter(event => event.event === EVENTS.GET_FRIEND_LIST),
    map(friendsEvent => friendsEvent.data),
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




  ngOnInit(): void {
    this.search$.pipe(debounceTime(400)).subscribe(search => {
      this.socketService.sendMessage({event: EVENTS.GET_ALL_USERS, query: search})
    })
    this.socketService.sendMessage({
      event: EVENTS.GET_FRIEND_LIST
    })
  }

  sendRequest(person: Friend){
    this.socketService.user$.pipe(filter(Boolean),take(1)).subscribe(user => {
      this.socketService.sendMessage({
        event: EVENTS.ADD_FRIEND,
        friend_id: person._id,
        user_id: user._id
      })
    })

  }
}
