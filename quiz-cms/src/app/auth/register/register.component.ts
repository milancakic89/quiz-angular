import { Component, OnInit } from '@angular/core';
import { basicDetails } from 'src/app/shared/basic-details';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  get register() { return this._registerDetails}

  public title = basicDetails.title

  ngOnInit(): void {
  }

  public onSubmit(){

  }

  private _registerDetails = {
    email: '',
    password: '',
    repeatPassword: ''
  }
}
