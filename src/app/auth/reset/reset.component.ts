import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../socket.service';
import { EVENTS } from '../../events';
import { filter, map } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/notifications.service';

@Component({
  selector: 'app-reset',
  imports: [FormsModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent implements OnInit{

  private _socketService = inject(SocketService);
  private _notifications = inject(NotificationService)
  private _router = inject(Router)

  activation = '';

  ngOnInit(): void {
    this._socketService.messages$.pipe(
      filter(socketData => socketData.event === EVENTS.ACCOUNT_ACTIVATED),
      map(data => data.data)
    ).subscribe(activated => {
      if(activated){
        this._router.navigateByUrl('');
        this._notifications.showMessage({
          type: 'SUCCESS',
          message: 'Activated. You can now login'
        })
      }
      this._router.navigateByUrl('')
    })
  }

  onchange(){
    this._socketService.sendMessage({
      event: EVENTS.ACCOUNT_ACTIVATED,
      email: this._socketService.tempEmail,
      activation_token: this.activation

    })
  }
}
