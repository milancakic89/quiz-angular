import { EventEmitter, Injectable } from "@angular/core";

export interface Noth{
    success: boolean;
    message: string;
}

@Injectable({providedIn: 'root'})
export class NotificationService{
    constructor(){}
    public notification = new EventEmitter<Noth>();

}