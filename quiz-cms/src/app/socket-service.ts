import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AppService } from './app.service';
import { ApiService } from './shared/api.servise';

@Injectable({providedIn: 'root'})
export class SocketService{
    constructor(private service: ApiService){
        this.socket = io('http://localhost:3000');
        this.listen();
    }

    public testConnection(){
        return this.service.get('/somelink', '')
    }

    public listen(){
        this.socket.on('test', data =>{
            console.log(data)
        })
    }

    private socket: Socket;
}