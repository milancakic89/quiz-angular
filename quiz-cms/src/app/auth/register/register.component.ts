import { Component, OnInit } from '@angular/core';
import { basicDetails } from 'src/app/shared/basic-details';
import { Configuration } from 'src/app/shared/config.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private config: Configuration) { }

  get register() { return this._registerDetails}

  public title = basicDetails.title

  ngOnInit(): void {
  }

  public onSubmit(){
    this.config.createUser(this._registerDetails.email, this._registerDetails.password)
  }

  private _registerDetails = {
    email: '',
    password: '',
    repeatPassword: ''
  }
}
