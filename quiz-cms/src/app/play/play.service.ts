import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "../shared/api.servise";

let allowBackButton = false;

export const allowBack = () =>{
    return allowBackButton;
}

export const setAllowBack = (value: boolean) =>{
    allowBackButton = value;
}
@Injectable({providedIn: 'root'})
export class PlayService{
    constructor(private service: ApiService){}

    get allowBackButton() { return allowBack()}
    set allowBackButton(value: boolean) { setAllowBack(value)}

    public checkQuestion(questionId: string, correct: boolean){
        return this.service.post<boolean>('/check-question', {questionId, correct}, '')
    }
    
    public saveQuizResults(){

    }

    public reduceOneLife(){
        return this.service.post<any>('/reduce-lives', {}, '')
    }
}