import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackMessageService } from 'src/app/feedback.service';
import { ApiService } from 'src/app/shared/api.servise';

import { Configuration, SignupResponse, User } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocialAuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private config: Configuration, 
              private router: Router,
              private socialAuthService: SocialAuthService,
              private notification: NotificationService) { }

  get login() { return this._loginDetails; }
  get isRoot(){ return this.config.isRoot}
  
  public user = null as unknown as User;
  public title = 'Kviz opsteg znanja';
  public feedbackClass = '';

  ngOnInit(): void {
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
        this.router.navigateByUrl('/profile')
      }
    })

    this.socialAuthService.authState.subscribe((user: any) => {
      this.user = user;
      // this.isSignedin = (user != null);
      console.log(this.user);
    });
  }

  public facebookSignin(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  public logOut(): void {
    this.socialAuthService.signOut();
  }

  public async onSubmit(){
    const { data, success, token, error } = await this.config.login(this._loginDetails.email, this._loginDetails.password) as any;
    if (success) {
      this.notification.notification.emit({ success: success, message: 'Dobrodosli' });
      this.config.saveUser(data, token);
    }else{
      this.notification.notification.emit({ success: false, message: error });
    }
  }


  private _loginDetails = {
    email: '',
    password: ''
  }

}
