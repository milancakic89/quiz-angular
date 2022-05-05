import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Configuration, SignupResponse, User } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';
import { SocketService } from 'src/app/socket-service';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


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
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private config: Configuration, 
              private router: Router,
              private socketService: SocketService,
              private notification: NotificationService) { }

  get login() { return this._loginDetails; }
  get isRoot(){ return this.config.isRoot}
  
  public user = null as unknown as User;
  public title = 'Kviz opsteg znanja';
  public feedbackClass = '';
  public centerLogin = false;
  public development = false;
  public subscription: Subscription = null as unknown as Subscription;

  ngOnInit(): void {
    if(window.innerHeight > 650){
      this.centerLogin = true;
    }
    this.subscription = this.socketService.socketData.subscribe(response =>{
      if(response && response.event === 'LOGIN'){
        this.config.saveUser(response.data.data, response.data.token)
        this.router.navigateByUrl('/profile')
      }
      if (response && response.event === 'ACCOUNT_NOT_ACTIVATED' ){
        this.notification.notification.emit({success: false, message: 'Nalog nije aktiviran. Proverite email'});
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

  public onSubmit(){
    this.socketService.emit('LOGIN', {email: this._loginDetails.email, password: this._loginDetails.password})
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
