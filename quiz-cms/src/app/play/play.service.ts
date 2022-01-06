import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "../shared/api.servise";
import { Configuration, User } from "../shared/config.service";

@Injectable({providedIn: 'root'})
export class PlayService{
    constructor(private service: ApiService, private config: Configuration){}

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
        return this.service.post<any>('/reduce-lives', {}, '')
    }
}