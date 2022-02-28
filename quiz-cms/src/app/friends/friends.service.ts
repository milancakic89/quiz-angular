import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";
import { User } from "../shared/config.service";

@Injectable({providedIn: 'root'})
export class FriendsService{
    constructor(private service: ApiService){}

    public searchUsers(query: string){
        return this.service.post<User[]>('/search-users', {query}, 'Nista nije pronadjeno za ovaj kriterijum')
    }

}