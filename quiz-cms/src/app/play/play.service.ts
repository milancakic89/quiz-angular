import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "../shared/api.servise";
import { Configuration, User } from "../shared/config.service";
import { SocketService } from "../socket-service";

@Injectable({providedIn: 'root'})
export class PlayService{
    constructor(private service: ApiService, private config: Configuration, private socketService: SocketService){}

    get allowBackButton() { return this.config.isGameRunning}
    set allowBackButton(value: boolean) { this.config.setGameRunning = value}

    public checkQuestion(questionId: string, correct: string){
        return this.service.post<boolean>('/check-question', {questionId, correct}, '')
    }

    public resetPlayingState(){
        return this.service.post<User>('/reset-playing-state', {}, '')
    }
    
    public saveQuizResults(){

    }

    public reduceOneLife(){
        return this.socketService.emit('REDUCE_LIVES', {})
    }
}