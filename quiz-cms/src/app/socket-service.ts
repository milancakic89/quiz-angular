import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import * as io from 'socket.io-client';
import { Configuration } from './shared/config.service';

export type EventType = 
'CREATE_ROOM' |
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
'ADD_FRIEND' |
'FRIEND_ALLREADY_REQUESTED' |
'USER_DISCONECTED' |
'USER_CONNECTED' |
'ADD_FRIEND_FAILED' |
'DISCONNECT_USER' |
'ACCEPT_FRIEND' |
'SAVE_SOCKET' |
'INVITE_FRIENDS' |
'TOURNAMENT_INVITATION' |
'LEAVED_ROOM' |
'LEAVE_ROOM' |
'LEAVE_ONE_ON_ONE' |
'OPONENT_ACCEPTED' |
'OPONENT_DECLINED' |
'JOINED_ROOM' |
'TOURNAMENT_STARTING' |
'ONLINE_USERS_COUNT' |
'BOTH_ACCEPTED' |
'JOIN_ONE_ON_ONE' |
'REFRESH_USER' |
'AUTOLOGIN' |
'LOGIN' |
'AUTOLOGINFAILED' |
'GET_FRIEND_LIST' |
'GET_FRIEND_REQUESTS' |
'GET_ALL_USERS' |
'OPONENT_FOUND' ;

export interface Room{
    roomName?: string;
    success?: boolean;
    user_id: string;
}

interface Socket{
    on: (event: EventType, data: any) => any;
    emit: (event: EventType, data: any) => any;
}

export interface SocketResponse{
    event: EventType;
    [key: string]: any;
}

@Injectable({providedIn: 'root'})
export class SocketService{
    public socket: Socket = null as unknown as Socket;
    public setupReady = false;

    public socketData = new BehaviorSubject<SocketResponse>({} as SocketResponse);
    public online = 0;
    
    constructor(private router: Router, private config: Configuration){
        if(!this.setupReady){
            this.socket = io.connect(environment.socketUrl);
            this.setup();
            this.setupReady = true;
            console.log('socket ready')
        }
      
    }
    
    public setup(){

        this.socket.on('CREATE_ROOM', (data: SocketResponse) =>{
            this.socketData.next(data)
        });
        this.socket.on('USER_DISCONECTED', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('USER_CONNECTED', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('JOIN_ROOM', (data: SocketResponse) =>{
            this.socketData.next(data)
        });
        this.socket.on('ROOM_CREATED', (data: SocketResponse) =>{
            this.socketData.next(data)
        });
        this.socket.on('JOINED_ROOM', (data: SocketResponse) =>{
            this.socketData.next(data)
        });

        this.socket.on('LEAVED_ROOM', (data: SocketResponse) =>{
            this.socketData.next(data)
        });

        this.socket.on('TOURNAMENT_STARTING', (data: SocketResponse) =>{
            this.socketData.next(data)
        })
        this.socket.on('START_TOURNAMENT_QUESTION', (data: SocketResponse) =>{
            this.socketData.next(data)
        })

        this.socket.on('SELECTED_QUESTION_LETTER', (data: SocketResponse) =>{
            this.socketData.next(data)
        })

        this.socket.on('UPDATE_WAITING_STATUS', (data: SocketResponse) =>{
            this.socketData.next(data)
        });

        this.socket.on('EVERYONE_ANSWERED', (data: SocketResponse) =>{
            this.socketData.next(data)
        });

        this.socket.on('TOURNAMENT_FINISHED', (data: SocketResponse) =>{
            this.socketData.next(data)
        });

        this.socket.on('GET_ROOM_QUESTION', (data: SocketResponse) =>{
            this.socketData.next(data)
        });
        this.socket.on('GET_ROOM_RESULTS', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('ADD_FRIEND', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('FRIEND_ALLREADY_REQUESTED', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('ADD_FRIEND_FAILED', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('ACCEPT_FRIEND', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('TOURNAMENT_INVITATION', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('OPONENT_FOUND', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('OPONENT_ACCEPTED', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('BOTH_ACCEPTED', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('OPONENT_DECLINED', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('LEAVE_ONE_ON_ONE' , (data: SocketResponse) => {
            this.socketData.next(data)
        }); 
        this.socket.on('ONLINE_USERS_COUNT', (data: SocketResponse) => {
            this.online = data.online;
        });
        this.socket.on('REFRESH_USER', (data: SocketResponse) => {
            this.socketData.next(data)
        }); 
        this.socket.on('AUTOLOGIN', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('LOGIN', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('AUTOLOGINFAILED', (data: SocketResponse) => {
            this.socketData.next(data)
            console.log('failed autologin')
        });
        this.socket.on('GET_ALL_USERS', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('GET_FRIEND_LIST', (data: SocketResponse) => {
            this.socketData.next(data)
        });
        this.socket.on('GET_FRIEND_REQUESTS', (data: SocketResponse) => {
            this.socketData.next(data)
        });
    }

    public emit(eventName: EventType, data: any){
        this.socket.emit(eventName, data)
    }
}