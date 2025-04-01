import { Component, inject, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { filter, take } from 'rxjs/operators';
import { EVENTS } from '../events';
import { BehaviorSubject } from 'rxjs';
import { Friend } from '../friends/types';
import { CommonModule } from '@angular/common';
import { User } from '../types';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  private _leaderboard$ = new BehaviorSubject<User[]>([]);

  socketService = inject(SocketService);

  leaderboard$ = this._leaderboard$.asObservable();

  ngOnInit(): void {
    this.socketService.sendMessage({event: EVENTS.GET_RANKING_LIST, query: ''});

    this.socketService.messages$.pipe(filter(socketEvent => socketEvent.event === EVENTS.GET_RANKING_LIST),take(1)).subscribe(data => {
      this._leaderboard$.next(data.data.sort((a,b) => b.score - a.score))
    }

    )
  }

}
