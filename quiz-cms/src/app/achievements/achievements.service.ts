import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";

@Injectable({providedIn: 'root'})
export class AchievementsService{
    constructor(private service: ApiService){}

    public getAchievements(){
        return this.service.get('/achievements')
    }
}