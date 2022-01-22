import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";

@Injectable({providedIn: 'root'})
export class SettingsService{
    constructor(private service: ApiService){}

    public saveSettings(settings: any){
        return this.service.post<any>('/update-settings', settings, 'Cuvanje nije uspelo. Pokusajte ponovo')
    }
    
}
