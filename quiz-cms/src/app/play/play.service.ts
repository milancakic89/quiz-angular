import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";

@Injectable({providedIn: 'root'})
export class PlayService{
    constructor(private service: ApiService){}

    public checkQuestion(questionId: string, correct: boolean){
        return this.service.post('/check-question', {questionId, correct})
    }
    public saveQuizResults(){

    }

    public reduceOneLife(){
        return this.service.post('/reduce-lives', {})
    }
}