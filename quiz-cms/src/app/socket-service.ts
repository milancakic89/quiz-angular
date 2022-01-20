import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { AppService } from './app.service';
import { ApiService } from './shared/api.servise';

@Injectable({providedIn: 'root'})
export class SocketService{
    public socket: any;

    constructor(private service: ApiService){    
        this.socket = io.connect('ws://localhost:3000');
    }

   

    public testConnection(){
        this.emit('message', 'this is angular message');
        this.listen('message')
        // return this.service.post('/enter-room',{}, '')
    }

    public listen(eventName?: string){
       this.socket.on(eventName, (data: any) =>{
           console.log(data)
       })
    }

    public emit(eventName: string, data: any){
        this.socket.emit(eventName, data)
    }

    public testEmit(){
        this.emit('message', 'some message')
    }
}