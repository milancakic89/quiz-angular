import { EventEmitter, Injectable } from "@angular/core";


export interface Feedback{
    success: boolean;
    message: string;
}

@Injectable({providedIn: 'root'})
export class FeedbackMessageService {

    public DailyPrice = new EventEmitter<boolean>();
}