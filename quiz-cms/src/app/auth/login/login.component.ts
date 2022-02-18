import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Configuration, SignupResponse, User } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';


declare var FB: any;

interface FBResponse{
  name: string;
  id: number;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(private config: Configuration, 
              private router: Router,
              private notification: NotificationService) { }

  get login() { return this._loginDetails; }
  get isRoot(){ return this.config.isRoot}
  
  public user = null as unknown as User;
  public title = 'Kviz opsteg znanja';
  public feedbackClass = '';
  public centerLogin = false;
  public development = false;

  ngOnInit(): void {
    if(window.innerHeight > 650){
      this.centerLogin = true;
    }
    // try{
    //   (window as any).fbAsyncInit = function () {
    //     FB.init({
    //       appId: '1043385909568285',
    //       xfbml: true,
    //       version: 'v12.0'
    //     });
    //     FB.AppEvents.logPageView();
    //   };

    //   (function (d, s, id) {
    //     var js: any, fjs: any = d.getElementsByTagName(s)[0];
    //     if (d.getElementById(id)) { return; }
    //     js = d.createElement(s); js.id = id;
    //     js.src = "https://connect.facebook.net/en_US/sdk.js";
    //     fjs.parentNode.insertBefore(js, fjs);
    //   }(document, 'script', 'facebook-jssdk'));
    // }catch(e){
    //   this.notification.notification.emit({success: false, message: 'Facebook init problem!!!'})
    // }

  }

  @HostListener('window:resize')
  checkCenterLogin(){
    if(window.innerHeight > 650){
      this.centerLogin = true;
    }
  }

  public facebookSignin(): void {
    try{
      FB.login((response: any) => {
        if (response.authResponse) {
          FB.api('/me', (res: FBResponse) => {
            this.loginFacebookUser(res.id, res.name)
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'public_profile,email' })
    }catch(e){
      this.notification.notification.emit({ success: false, message: 'Facebook login problem!!!' })
    }

  }


  ngAfterViewInit(): void {
    // document.exitFullscreen();
      this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
        this.router.navigateByUrl('/profile')
      }
    })
  }

  public logOut(): void {
    try{
      FB.logout()
    }catch(e){
      this.notification.notification.emit({ success: false, message: 'Facebook logout problem!!!' })
    }
  
  }

  public async loginFacebookUser(id: number, name: string){
    const { success, data, token } = await this.config.facebookLogin(id, name)
    if(success){
      let href = location.href;
      this.config.saveUser(data, token);
      location.href = href + '/profile';
    }
  }

  public async onSubmit(){
    if(this.development){
      return this.testLogin();
    }
    const { data, success, token, error } = await this.config.login(this._loginDetails.email, this._loginDetails.password) as any;
    if (success) {
      this.notification.notification.emit({ success: success, message: 'Dobrodosli' });
      this.config.saveUser(data, token);
    }else{
      this.notification.notification.emit({ success: false, message: error });
    }
  }

  public testLogin(){
    this.config.logged = true;
    this.config.isRoot = true;
    this.router.navigateByUrl('/profile');
    return;
  }


  private _loginDetails = {
    email: '',
    password: ''
  }

}
