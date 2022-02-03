import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import * as io from 'socket.io-client';

export type EventType = 'CREATE_ROOM' |
'JOIN_ROOM' | 
'ROOM_CREATED' |
'LOAD-ROOM-USERS' |
'LEAVE-ROOM';

export interface Room{
    roomName?: string;
    success?: boolean;
    user_id: string;
}

@Injectable({providedIn: 'root'})
export class SocketService{
    public socket: any;

    public socketData = new BehaviorSubject<any>(null);

    constructor(private router: Router){
        this.socket = io.connect(environment.socketUrl);
        this.setup();
    }
    
    public setup(){
        this.socket.on('CREATE_ROOM', (data: Room) =>{
            this.socketData.next(data)
        });
        this.socket.on('JOIN_ROOM', (data: Room) =>{
            this.socketData.next(data)
        });
        this.socket.on('ROOM_CREATED', (data: Room) =>{
            this.socketData.next(data)
        });
        this.socket.on('JOINED_ROOM', (data: Room) =>{
            this.socketData.next(data)
        });
        this.socket.on('ROOM_DONT_EXIST', (data: Room) =>{
            this.socketData.next(data)
        });
        this.socket.on('LEAVED_ROOM', (data: Room) =>{
            console.log('leaving room', data)
            this.socketData.next(data)
        });
    }

    public emit(eventName: EventType, data: any){
        this.socket.emit(eventName, data)
    }
}