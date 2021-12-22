import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackMessageService } from 'src/app/feedback.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  constructor(private notification: NotificationService,
              private router: Router) { }

  get email(){ return this._resetDetails.email}
  set email(value){ this._resetDetails.email = value}

  public title = 'Kviz opsteg znanja';

  ngOnInit(): void {
    this.notification.notification.emit({ success: false, message: 'Ova opcija je u fazi izrade' });
    setTimeout(()=>{
      this.router.navigateByUrl('/')
    }, 1000);
  }


  public onSubmit(){}

  private _resetDetails = {
    email: ''
  }
}
