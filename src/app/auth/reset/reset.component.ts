import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FeedbackMessageService } from 'src/app/feedback.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  constructor(private notification: NotificationService,
              private socket: SocketService,
              private router: Router) { }

  get email(){ return this._resetDetails.email}
  set email(value){ this._resetDetails.email = value}

  public title = 'Kviz opsteg znanja';
  public centerLogin = false;
  public subscription: Subscription = null as unknown as Subscription;

  ngOnInit(): void {
    if(window.innerHeight > 650){
      this.centerLogin = true;
    }

    this.subscription = this.socket.socketData.subscribe( data =>{
      if(data && data.event === 'RESET_PASSWORD'){
        this.notification.notification.emit({ success: true, message: 'Uspesno. Proverite email' })
      }
      if (data && data.event === 'RESET_PASSWORD_FAILED') {
        this.notification.notification.emit({ success: false, message: 'Resetovanje nije uspelo' })
      }

      if (data && data.event === 'EMAIL_NOT_EXIST' ) {
        this.notification.notification.emit({ success: false, message: 'Nalog nije pronadjen' })
      }
    })
  }

  @HostListener('window:resize')
  checkCenterLogin(){
    if(window.innerHeight > 650){
      this.centerLogin = true;
    }
  }

  public onSubmit(){
    this.socket.emit('RESET_PASSWORD', {email: this._resetDetails.email});
   
  }

  private _resetDetails = {
    email: ''
  }
}
