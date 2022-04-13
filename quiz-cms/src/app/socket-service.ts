import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import * as io from 'socket.io-client';
import { Configuration } from './shared/config.service';
import { AppComponent } from './app.component';

export type EventType = 'connection' |
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
    'AUTOLOGIN_AVAILABLE' |
    'AUTOLOGIN' |
    'REGISTER' |
    'LOGIN' |
    'AUTOLOGINFAILED' |
    'GET_FRIEND_LIST' |
    'GET_FRIEND_REQUESTS' |
    'GET_ALL_USERS' |
    'ADD_QUESTION' |
    'GET_QUESTION' |
    'UPDATE_QUESTION' |
    'ADD_IMAGE_QUESTION' |
    'GET_QUESTIONS' |
    'GET_RANKING_LIST' |
    'CHECK_QUESTION' |
    'DELETE_QUESTION' |
    'GET_DAILY_REWARD' |
    'RESET_PLAYING_STATE' |
    'RESET_LIVES' |
    'UPDATE_SCORE' |
    'OPONENT_FOUND' |
    'UPDATE_SETTINGS' |
    'REMOVE_NOTIFICATION' |
    'GET_ACHIEVEMENTS' |
    'UPLOAD_IMAGE' |
    'MATCH_FOUND' |
    'TRACK_ONE_ON_ONE' |
    'TRACK_QUEUE_MANAGER' |
    'REDUCE_LIVES';

export interface Room {
    roomName?: string;
    success?: boolean;
    user_id: string;
}

interface Socket {
    on: (event: EventType, data: any) => any;
    emit: (event: EventType, data: any) => any;
}

export interface SocketResponse {
    event: EventType;
    [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
    public socket: Socket = null as unknown as Socket;
    public setupReady = false;

    public socketData = new BehaviorSubject<SocketResponse>({} as SocketResponse);
    public online = 0;

    public EMITED = '';
    public RECEIVED_EVENT = '';
    public RECEIVED_DATA = null;

    constructor(private router: Router, private config: Configuration) {
        if (!this.setupReady) {
            this.socket = io.connect(environment.socketUrl);
            this.setup();
            this.setupReady = true;
        }

    }

    get token() { return localStorage.getItem('access') }

    public setup() {

        this.socket.on('AUTOLOGIN_AVAILABLE', (data: SocketResponse) => {
            this.socketData.next(data)
        });

        this.socket.on('CREATE_ROOM', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('USER_DISCONECTED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('USER_CONNECTED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('JOIN_ROOM', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('ROOM_CREATED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('JOINED_ROOM', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });

        this.socket.on('LEAVED_ROOM', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });

        this.socket.on('TOURNAMENT_STARTING', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        })
        this.socket.on('START_TOURNAMENT_QUESTION', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        })

        this.socket.on('SELECTED_QUESTION_LETTER', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        })

        this.socket.on('UPDATE_WAITING_STATUS', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });

        this.socket.on('EVERYONE_ANSWERED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });

        this.socket.on('TOURNAMENT_FINISHED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });

        this.socket.on('GET_ROOM_QUESTION', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('GET_ROOM_RESULTS', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('ADD_FRIEND', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('FRIEND_ALLREADY_REQUESTED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('ADD_FRIEND_FAILED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('ACCEPT_FRIEND', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('TOURNAMENT_INVITATION', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('OPONENT_FOUND', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('OPONENT_ACCEPTED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('BOTH_ACCEPTED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('OPONENT_DECLINED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('LEAVE_ONE_ON_ONE', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('ONLINE_USERS_COUNT', (data: SocketResponse) => {
            this.online = data.online;
        });
        this.socket.on('REFRESH_USER', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('AUTOLOGIN', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('LOGIN', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('REGISTER', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('AUTOLOGINFAILED', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('GET_ALL_USERS', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('GET_FRIEND_LIST', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('GET_FRIEND_REQUESTS', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('ADD_QUESTION', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('ADD_IMAGE_QUESTION', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('UPDATE_QUESTION', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('GET_QUESTIONS', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('GET_RANKING_LIST', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('DELETE_QUESTION', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('CHECK_QUESTION', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('GET_DAILY_REWARD', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('RESET_LIVES', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('RESET_PLAYING_STATE', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('UPDATE_SCORE', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('UPDATE_SETTINGS', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('REMOVE_NOTIFICATION', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('REDUCE_LIVES', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('GET_ACHIEVEMENTS', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('MATCH_FOUND', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('UPLOAD_IMAGE', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
        this.socket.on('TRACK_QUEUE_MANAGER', (data: SocketResponse) => {
            this.socketData.next(data)
            this.RECEIVED_EVENT = data.event
            this.RECEIVED_DATA = data.data
        });
    }

    public emit(eventName: EventType, data: any) {
        this.EMITED = eventName;
        if (this.token) {
            const token = this.token;
            data.Authorization = token;
        }
       
        this.socket.emit(eventName, data)
    }
}