import { inject, Injectable } from "@angular/core";
import { filter, Subject, throttleTime } from "rxjs";
import { EVENTS }from "../events";
import { SocketService } from "../socket.service";

interface NotificationMessage {
    type: '' | 'ERROR' | 'SUCCESS' | 'INFO',
    message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private _socketService = inject(SocketService);

    private _notification$ = new Subject<NotificationMessage>();

    notification$ = this._notification$.asObservable().pipe(filter(Boolean), throttleTime(1000));

    showMessage(notification: NotificationMessage): void {
        this._notification$.next(notification);
        setTimeout(() => {
            this._notification$.next(null);
        }, 3000)
    }

    messages$ = this._socketService.messages$.subscribe(
        event => {
            console.log(event)
            this.handleEventMessage(event.event)
        }
    )

    handleEventMessage(event: any): void {
        //some evets are fired additionaly, we want to prevent showing those so each event must switch to true
        let showMessage = false;

        const message: NotificationMessage = {
            type: 'ERROR',
            message: ''
        }

        switch (event) {
            case EVENTS.LOGIN:
                showMessage = true;
                message.type = 'SUCCESS';
                message.message = 'Welcome';
                break;
            case EVENTS.INCORRECT_LOGIN_DETAILS:
                showMessage = true;
                message.type = 'ERROR';
                message.message = 'Incorrect login details. Try again';
                break;
            case EVENTS.REGISTER:
                showMessage = true;
                message.type = 'SUCCESS';
                message.message = 'Account created. Check your email for activation';
                break;
            case EVENTS.EMAIL_ALLREADY_EXIST:
                showMessage = true;
                message.type = 'ERROR';
                message.message = 'Email allready exists';
                break;
            case EVENTS.ACCOUNT_NOT_ACTIVATED:
                showMessage = true;
                message.type = 'ERROR';
                message.message = 'Account not activated';
                break;
            case EVENTS.ADD_FRIEND:
                showMessage = true;
                message.type = 'SUCCESS';
                message.message = 'Request sent';
                break;
            case EVENTS.ACCEPT_FRIEND:
                    showMessage = true;
                    message.type = 'SUCCESS';
                    message.message = 'Accepted';
                    break;
            case EVENTS.FRIEND_ALLREADY_REQUESTED:
                showMessage = true;
                message.type = 'INFO';
                message.message = 'Request allready sent';

        }

        if (showMessage) {
            this.showMessage(message);
        }


    }
}