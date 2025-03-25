import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NotificationService } from './shared/notifications.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, tap } from 'rxjs';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  notificationService = inject(NotificationService);
  socketService = inject(SocketService)

  private _showNotification$ = new BehaviorSubject<boolean>(false);

  showNotification$ = this._showNotification$.asObservable();

  user$ = this.socketService.user$.pipe(tap(console.log));

  notifications$ = this.notificationService.notification$.pipe(tap(() => {
      this._showNotification$.next(true);
      this.hideNotification();
  }));

  hideNotification(){
    setTimeout(() => {
      this._showNotification$.next(false)
    }, 3000)
  }

  logout(){
    this.socketService.saveUser(null);
  }
}
