import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";
import { Achievement } from "./achievements.component";

@Injectable({providedIn: 'root'})
export class AchievementsService{
    constructor(private service: ApiService){}

    public getAchievements(){
        return this.service.get<Achievement[]>('/achievements', 'Pristup dostignucima neuspesan. Pokusajte ponovo')
    }
}