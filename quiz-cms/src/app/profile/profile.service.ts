import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";

@Injectable({providedIn: 'root'})
export class ProfileService{
    constructor(private service: ApiService){}

    public updateName(name: string){
        return this.service.post('/name', {name})
    }
}