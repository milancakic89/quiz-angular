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
        this.user = user;
        this.router.navigateByUrl('/profile')
      }
    })
  }

  public async onSubmit(){
    const { data, success, token } = await this.config.login(this._loginDetails.email, this._loginDetails.password) as any;
    if (success) {
      this.feedbackService.feedback.emit({ success: success, message: '' });
      this.config.saveUser(data, token);
    }
  }

  private _loginDetails = {
    email: '',
    password: ''
  }

}
