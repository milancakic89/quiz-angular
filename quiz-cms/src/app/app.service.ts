import { Injectable } from "@angular/core";
import { ApiService } from "./shared/api.servise";
import { User } from "./shared/config.service";

@Injectable({providedIn: 'root'})
export class AppService{
    constructor(private service: ApiService){}

 
    public updateScore(score: number){
        return this.service.post('/score', {score}, '');
    }

    public claimDailyReward() {
        return this.service.get<User>('/daily-reward','Doslo je do greske prilikom preuzimanja dnevne nagrade. Pokusajte ponovo');
    }
}