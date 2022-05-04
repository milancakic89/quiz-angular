import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FeedbackMessageService } from 'src/app/feedback.service';
import { basicDetails } from 'src/app/shared/basic-details';
import { Configuration } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  constructor(private config: Configuration, 
              private notification: NotificationService,
              private socketService: SocketService,
              private router: Router) { }

  get register() { return this._registerDetails}

  public title = basicDetails.title;
  public centerLogin = false;
  public subscription: Subscription = null as unknown as Subscription;

  ngOnInit(): void {
    if(window.innerHeight > 550){
      this.centerLogin = true;
    }
    this.subscription = this.socketService.socketData.subscribe(data =>{
      if(data && data.event === 'REGISTER'){
        this.notification.notification.emit({success: true, message: 'Nalog kreiran. Proverite email'});
        this.router.navigateByUrl('/login')
      }
      if(data && data.event === 'INCORRECT_LOGIN_DETAILS'){
        this.notification.notification.emit({success: false, message: 'Proverite unete podatke'});
      }
      if(data && data.event === 'EMAIL_ALLREADY_EXIST' ){
        this.notification.notification.emit({success: false, message: 'Email vec postoji'});
      }
    })
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  @HostListener('window:resize')
  checkCenterLogin(){
    if(window.innerHeight > 650){
      this.centerLogin = true;
    }
  }

  public async onSubmit(){
    this.socketService.emit('REGISTER', { email: this._registerDetails.email, password: this._registerDetails.password})
    
  }

  private _registerDetails = {
    email: '',
    password: '',
    repeatPassword: ''
  }
}
