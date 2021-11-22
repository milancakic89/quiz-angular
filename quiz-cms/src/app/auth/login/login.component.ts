import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackMessageService } from 'src/app/feedback.service';
import { initialQuestionsSetup } from 'src/app/questions/initial';
import { ApiService } from 'src/app/shared/api.servise';
import { Configuration, SignupResponse } from 'src/app/shared/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private config: Configuration, 
              private router: Router,
              private feedbackService: FeedbackMessageService) { }

  get login() { return this._loginDetails; }
  get isRoot(){ return this.config.isRoot}
  
  public user = null;
  public title = 'Kviz opsteg znanja';
  public feedbackClass = '';

  ngOnInit(): void {
    this.config.user.subscribe(user =>{
      if(user){
        console.log('have user redirect')
        this.user = user;
        this.router.navigateByUrl('/profile')
      }
    })


  }

  public onSubmit(){
   this.config.login(this._loginDetails.email, this._loginDetails.password).subscribe((data: SignupResponse | any) =>{
    if(data){
      this.feedbackService.feedback.emit({success: data.success, message: data.message});
      if(data.user){
          this.config.saveUser(data.user, data.token);
      }
    }   
   })
  }

  private _loginDetails = {
    email: '',
    password: ''
  }

}
