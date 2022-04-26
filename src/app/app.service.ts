import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./shared/api.servise";
import { User } from "./shared/config.service";
import { SocketService } from "./socket-service";

@Injectable({providedIn: 'root'})
export class AppService{
    constructor(private service: SocketService){}
 
    public updateScore(score: number){
        return this.service.emit('UPDATE_SCORE', {score});
    }
}