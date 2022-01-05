import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";
import { User } from "../shared/config.service";

@Injectable({providedIn: 'root'})
export class ProfileService{
    constructor(private service: ApiService){}
    

    public updateName(name: string){
        return this.service.post('/name', {name}, '')
    }

    public resetLives(){
        return this.service.get<User>('/reset-lives', '')
    }
}