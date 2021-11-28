import { EventEmitter, Injectable } from "@angular/core";
import { ApiService } from "./shared/api.servise";

@Injectable({providedIn: 'root'})
export class AppService{
    constructor(private service: ApiService){}

 
    public updateScore(score: number){
        return this.service.post('/score', {score});
    }
}