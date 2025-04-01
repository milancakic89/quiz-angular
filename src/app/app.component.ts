import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NotificationService } from './shared/notifications.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, filter, take, tap } from 'rxjs';
import { SocketService } from './socket.service';
import { DialogService } from './shared/dialog.service';
import { ModalNotificationComponent } from './shared/modal-notification/modal-notification.component';
import { EVENTS } from './events';
import { RoomService } from './room/model/room.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  notificationService = inject(NotificationService);
  socketService = inject(SocketService)
  dialogService = inject(DialogService);
  roomService = inject(RoomService);
  router = inject(Router)

  private _showNotification$ = new BehaviorSubject<boolean>(false);

  private userPlaying = false;

  showNotification$ = this._showNotification$.asObservable();

  user$ = this.socketService.user$.pipe(tap(console.log));

  notifications$ = this.notificationService.notification$.pipe(tap(() => {
    this._showNotification$.next(true);
    this.hideNotification();
  }));

  ngOnInit(): void {
    this.roomService.userPlaying$.subscribe(playing => {
      this.userPlaying = playing;
    });

    this.socketService.messages$.pipe(
      filter(socketEvent => {
        return socketEvent.event === EVENTS.TOURNAMENT_INVITATION && !this.userPlaying
      })
    ).subscribe((invitation: any) => {
      this.dialogService.openDialog(ModalNotificationComponent, {
        header: 'Tournament invitation',
        message: `${invitation.userName} is inviting you to the tournament`,
        confirmLabel: 'Accept',
        cancelLabel: 'Cancel',
        confirm: () => {
          this.roomService.setRoomId(invitation.roomName);
          this.router.navigate(['/dashboard','room', invitation.roomName]);
        },
      })
    });
  }

  hideNotification() {
    setTimeout(() => {
      this._showNotification$.next(false)
    }, 3000)
  }

  logout() {
    this.socketService.saveUser(null);
  }
}
