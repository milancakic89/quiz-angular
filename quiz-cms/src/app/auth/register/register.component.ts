import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackMessageService } from 'src/app/feedback.service';
import { basicDetails } from 'src/app/shared/basic-details';
import { Configuration } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private config: Configuration, 
              private notification: NotificationService,
              private router: Router) { }

  get register() { return this._registerDetails}

  public title = basicDetails.title

  ngOnInit(): void {
  }

  public async onSubmit(){
    const { data, success, error } = await this.config.createUser(this._registerDetails.email, this._registerDetails.password);
    if(success){
        this.notification.notification.emit({ success: data.success, message: 'Nalog kreiran' });
        this.router.navigateByUrl('/profile')
    }else{
      this.notification.notification.emit({ success: data.success, message: error });
    }
  }

  private _registerDetails = {
    email: '',
    password: '',
    repeatPassword: ''
  }
}
