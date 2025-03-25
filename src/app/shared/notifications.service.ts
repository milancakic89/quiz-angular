import { Injectable } from "@angular/core";
import { filter, Subject, throttleTime } from "rxjs";
import { EVENTS } from "../events";

interface NotificationMessage {
    type: '' | 'ERROR' | 'SUCCESS',
    message: string;
}

@Injectable({ providedIn: 'root'})
export class NotificationService {
    private _notification$ = new Subject<NotificationMessage>();

    notification$ = this._notification$.asObservable().pipe(filter(Boolean), throttleTime(1000));

    showMessage(notification: NotificationMessage): void {
        this._notification$.next(notification);
        setTimeout(() => {
            this._notification$.next(null);
        }, 3000)
    }

    handleEventMessage(event: EVENTS, type: NotificationMessage['type']): void {
        const message: NotificationMessage = {
            type: type,
            message: ''
        }

        switch(event){
            case EVENTS.LOGIN:
                message.message = 'Welcome';
                break;
            case EVENTS.INCORRECT_LOGIN_DETAILS:
                message.message = 'Incorrect login details. Try again';
                break;

            default:
                message.message = 'Something went wrong!';
                break;
        }

        this.showMessage(message);
    }
}