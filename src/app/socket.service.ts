// socket.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface SocketEvent {
    event: string;
    [key:string]: any;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;
  private _messages$ = new BehaviorSubject<SocketEvent>(null as unknown as SocketEvent);
  private _user$ = new BehaviorSubject<any>(null)

  messages$ = this._messages$.asObservable().pipe(filter(Boolean));

  user$ = this._user$.asObservable()
  

  constructor() {
    this.socket = io('http://localhost:4000'); // Connect to Socket.IO server
    this.socket.onAny((_: any, data: SocketEvent) => {
        this._messages$.next(data);
    });
    this.socket.on('LOGIN', ({ data }: any) => {
      this.saveUser(data);
    })

  }

  sendMessage(eventData: SocketEvent): void {
    this.socket.emit(eventData.event, eventData);
  }

  saveUser(user: any){
    this._user$.next(user);
  }
}