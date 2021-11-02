import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  get login() { return this._loginDetails}

  public title = 'Kviz opsteg znanja';

  ngOnInit(): void {
  }

  public onSubmit(){}

  private _loginDetails = {
    email: '',
    password: ''
  }

}
