import { Injectable } from "@angular/core";
import { AppService } from "../app.service";
import { ApiService } from "../shared/api.servise";
import { User } from "../shared/config.service";

@Injectable({providedIn: 'root'})
export class ProfileService{
    constructor(private service: ApiService, private appService: AppService){}
    

    public updateName(name: string){
        return this.service.post('/name', {name}, '')
    }

    public resetLives(){
        return this.service.get<User>('/reset-lives', '')
    }

    public calculateResetTime(timeInMs: number){
        const reset = new Date(timeInMs).getTime();
        const now = Date.now();
        const dif = reset - now;
        const minutes = new Date(dif).getMinutes();
        return minutes;
      }
}