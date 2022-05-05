import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private notification: NotificationService,
    private socket: SocketService,
    private router: Router) { }

  get reset() { return this._resetDetails }
  set reset(value) { this._resetDetails = value }

  public title = 'Kviz opsteg znanja';
  public centerLogin = false;
  public subscription: Subscription = null as unknown as Subscription;

  ngOnInit(): void {
    if (window.innerHeight > 650) {
      this.centerLogin = true;
    }

    this.subscription = this.socket.socketData.subscribe(data => {
      if (data && data.event === 'RESET_PASSWORD_CONFIRMATION') {
        this.notification.notification.emit({ success: true, message: 'Uspesno' });
        this.router.navigateByUrl('');
      }
      if (data && data.event === 'RESET_PASSWORD_FAILED') {
        this.notification.notification.emit({ success: false, message: 'Resetovanje nije uspelo' })
      }

      if (data && data.event === 'EMAIL_NOT_EXIST') {
        this.notification.notification.emit({ success: false, message: 'Nalog nije pronadjen. Proverite unete podatke' })
      }

    })
  }

  @HostListener('window:resize')
  checkCenterLogin() {
    if (window.innerHeight > 650) {
      this.centerLogin = true;
    }
  }

  public onSubmit() {
    console.log(this._resetDetails)
    this.socket.emit('RESET_PASSWORD_CONFIRMATION', { data: this._resetDetails });

  }

  private _resetDetails = {
    email: '',
    code: '',
    password: '',
    repeat: ''
  }

}
