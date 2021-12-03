import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";
import { User } from "../shared/config.service";

@Injectable({providedIn: 'root'})
export class RankingService{
    constructor(private apiService: ApiService){}

    public getRankingList(filter: number){
        return this.apiService.post<User[]>('/ranking-list', {filter}, '')
    }
}