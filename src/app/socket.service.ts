// socket.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, tap, take } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import  { EVENTS } from './events';
import { User } from './types';

export interface SocketEvent {
    event: EVENTS;
    data?: any;
    [key:string]: any;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;
  private _messages$ = new BehaviorSubject<SocketEvent>(null as unknown as SocketEvent);
  private _user$ = new BehaviorSubject<User>(null);
  private _token = '';

  messages$ = this._messages$.asObservable().pipe(filter(Boolean));

  user$ = this._user$.asObservable();

  constructor() {
    this.socket = io('http://localhost:4000'); // Connect to Socket.IO server
    this.socket.onAny((_: any, data: SocketEvent) => {
      console.log(data)
        this._messages$.next(data);
    });
    this.socket.on('LOGIN', (data: any) => {
      this._token = data.token;
      this.saveUser(data.data);
    })

  }

  sendMessage(eventData: SocketEvent): void {
    const data = {
      ...eventData,
      Authorization: this._token || null
    }
    this.socket.emit(eventData.event, data);
  }

  saveUser(user: any){
    this._user$.next(user);
  }
}