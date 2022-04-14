import { Injectable } from "@angular/core";
import { AppService } from "../app.service";
import { ApiService } from "../shared/api.servise";
import { User } from "../shared/config.service";
import { SocketService } from "../socket-service";

@Injectable({providedIn: 'root'})
export class ProfileService{
    constructor(private service: ApiService, private appService: AppService, private socketService: SocketService){}
    

    public updateName(name: string){
        return this.service.post('/name', {name}, '')
    }

    public resetLives(){
        return this.socketService.emit('RESET_LIVES', {})
    }

    public removeNotification(){
        return this.service.post<User>('/remove-notification', {}, '')
    }

    public calculateResetTime(future_ms: number){
        let total_seconds = future_ms;
        let counter = 0;
        let minutes = 0;
        let seconds = 0;
        while((total_seconds - 60) > counter){
            counter += 60;
            minutes++;
        }
        seconds = total_seconds - counter;
        return {
            minutes,
            seconds
        };
      }
}
