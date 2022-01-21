import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

export type EventType = 'CREATE-ROOM' |
'JOIN-ROOM' | 'ROOM-CREATED';

export interface Room{
    roomName?: string;
    user_id: string;
}

@Injectable({providedIn: 'root'})
export class SocketService{
    public socket: any;

    public socketData = new BehaviorSubject<any>(null);

    constructor(){
        this.socket = io.connect('ws://localhost:3000');
        this.setup();
    }
    
    public setup(){
        this.socket.on('CREATE-ROOM', (data: any) =>{
            console.log('create room')
            this.socketData.next(data)
        });
        this.socket.on('JOIN-ROOM', (data: any) =>{
            console.log('join room')
            this.socketData.next(data)
        });
        this.socket.on('ROOM-CREATED', (data: any) =>{
            console.log('room is created', data)
            this.socketData.next(data)
        });
    }

    public emit(eventName: EventType, data: Room){
        this.socket.emit(eventName, data)
    }
}