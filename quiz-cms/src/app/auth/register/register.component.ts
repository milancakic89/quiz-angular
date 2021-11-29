import { Component, OnInit } from '@angular/core';
import { FeedbackMessageService } from 'src/app/feedback.service';
import { basicDetails } from 'src/app/shared/basic-details';
import { Configuration } from 'src/app/shared/config.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private config: Configuration, private feedbackService: FeedbackMessageService) { }

  get register() { return this._registerDetails}

  public title = basicDetails.title

  ngOnInit(): void {
  }

  public async onSubmit(){
    const { data, success } = await this.config.createUser(this._registerDetails.email, this._registerDetails.password);
    if(success){
        this.feedbackService.feedback.emit({ success: data.success, message: data.message })
    }
  }

  private _registerDetails = {
    email: '',
    password: '',
    repeatPassword: ''
  }
}
