import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NotificationService } from './shared/notifications.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, tap } from 'rxjs';
import { SocketService } from './socket.service';
import { DialogService } from './shared/dialog.service';
import { ModalNotificationComponent } from './shared/modal-notification/modal-notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  notificationService = inject(NotificationService);
  socketService = inject(SocketService)
  dialogService = inject(DialogService);

  private _showNotification$ = new BehaviorSubject<boolean>(false);

  showNotification$ = this._showNotification$.asObservable();

  user$ = this.socketService.user$.pipe(tap(console.log));

  notifications$ = this.notificationService.notification$.pipe(tap(() => {
      this._showNotification$.next(true);
      this.hideNotification();
  }));

  ngOnInit(): void {
    // this.dialogService.openDialog(ModalNotificationComponent, {
    //   header: 'TEST',
    //   message: 'You have friend requests',
    //   confirmLabel: 'Ok',
    //   confirm: () => {
    //     console.log('modal confirmed')
    //   },
    // })
  }

  hideNotification(){
    setTimeout(() => {
      this._showNotification$.next(false)
    }, 3000)
  }

  logout(){
    this.socketService.saveUser(null);
  }
}
