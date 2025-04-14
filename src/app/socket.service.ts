// socket.service.ts
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, tap, take, mapTo, startWith, debounceTime } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import  { EVENTS } from './events';
import { User } from './types';
import { Router } from '@angular/router';

export interface SocketEvent {
    event: EVENTS;
    data?: any;
    [key:string]: any;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private _router = inject(Router)
  private socket: Socket;
  private _messages$ = new BehaviorSubject<SocketEvent>(null as unknown as SocketEvent);
  private _user$ = new BehaviorSubject<User>(null);
  private _token = '';

  messages$ = this._messages$.asObservable().pipe(filter(Boolean));

  user$ = this._user$.asObservable();

  isAdmin$ = this.user$.pipe(filter(Boolean),map(user => user.roles.some(role => role === 'ADMIN')));

  myId = '';
  myselfUsername = '';

  tempEmail = '';
  activateRouteAllow = false;

  constructor() {
    this.createSocket()
  }

  createSocket(){
    const url = location.origin;
    this.socket = io('https://quiz-ts.onrender.com'); // Connect to Socket.IO server
    this.socket.onAny((_: any, data: SocketEvent) => {
      if(location.href.includes('localhost')){
        console.log(data)
      }
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

  clearMessageChanel(){
    this._messages$.next(null);
  }

  connect(){
    if(this.socket.disconnected){
      this.socket.connect()
    }
  }

  saveUser(user: User){
    if(user){
      this.myId = user._id;
      this.myselfUsername = user.name;
    }else{
      this.myId = null;
      this.myselfUsername = null;
      location.reload()
    }
    this._user$.next(user);
  
  }
}