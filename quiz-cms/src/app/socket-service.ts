import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import * as io from 'socket.io-client';

export type EventType = 'CREATE_ROOM' |
'JOIN_ROOM' | 
'ROOM_CREATED' |
'LOAD-ROOM-USERS' |
'START_TOURNAMENT' |
'SELECTED_QUESTION_LETTER' |
'START_TOURNAMENT_QUESTION' |
'UPDATE_WAITING_STATUS' |
'TOURNAMENT_FINISHED' |
'GET_ROOM_QUESTION' |
'EVERYONE_ANSWERED' |
'GET_ROOM_RESULTS' |
'CLEAN_THE_EMPTY_ROOMS' |
'LEAVE_ROOM';

export interface Room{
    roomName?: string;
    success?: boolean;
    user_id: string;
}

@Injectable({providedIn: 'root'})
export class SocketService{
    public socket: any;
    public setupReady = false;

    public socketData = new BehaviorSubject<any>(null);
    
    constructor(private router: Router){
        if(!this.setupReady){
            this.socket = io.connect(environment.socketUrl);
            this.setup();
            this.setupReady = true;
        }
      
    }
    
    public setup(){
        this.socket.on('CREATE_ROOM', (data: Room) =>{
            console.log('CREATE_ROOM')
            this.socketData.next(data)
        });
        this.socket.on('JOIN_ROOM', (data: Room) =>{
            console.log('JOIN_ROOM')
            this.socketData.next(data)
        });
        this.socket.on('ROOM_CREATED', (data: Room) =>{
            console.log('ROOM_CREATED')
            this.socketData.next(data)
        });
        this.socket.on('JOINED_ROOM', (data: Room) =>{
            console.log('JOINED_ROOM')
            this.socketData.next(data)
        });
        this.socket.on('ROOM_DONT_EXIST', (data: Room) =>{
            console.log('ROOM_DONT_EXIST')
            this.socketData.next(data)
        });
        this.socket.on('LEAVED_ROOM', (data: Room) =>{
            this.socketData.next(data)
            console.log('LEAVED_ROOM')
        });

        this.socket.on('TOURNAMENT_STARTING', (data: any) =>{
            this.socketData.next(data)
            console.log('TOURNAMENT_STARTING')
        })
        this.socket.on('START_TOURNAMENT_QUESTION', (data: any) =>{
            this.socketData.next(data)
            console.log('START_TOURNAMENT_QUESTION')
        })

        this.socket.on('SELECTED_QUESTION_LETTER', (data: any) =>{
            this.socketData.next(data)
            console.log('SELECTED_QUESTION_LETTER')
        })

        this.socket.on('UPDATE_WAITING_STATUS', (data: any) =>{
            this.socketData.next(data)
            console.log('UPDATE_WAITING_STATUS')
        });

        this.socket.on('EVERYONE_ANSWERED', (data: any) =>{
            this.socketData.next(data)
            console.log('EVERYONE_ANSWERED')
        });

        this.socket.on('TOURNAMENT_FINISHED', (data: any) =>{
            this.socketData.next(data)
            console.log('TOURNAMENT_FINISHED')
        });

        this.socket.on('GET_ROOM_QUESTION', (data: any) =>{
            this.socketData.next(data)
            console.log('GET_ROOM_QUESTION')
        });
        this.socket.on('GET_ROOM_RESULTS', (data: any) => {
            this.socketData.next(data)
            console.log('GET_ROOM_RESULTS')
        });
    }

    public emit(eventName: EventType, data: any){
        this.socket.emit(eventName, data)
    }
}