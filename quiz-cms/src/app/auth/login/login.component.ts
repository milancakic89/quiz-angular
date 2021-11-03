import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/app.component';
import { Configuration } from 'src/app/shared/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private config: Configuration, private router: Router) { }

  get login() { return this._loginDetails; }
  
  public user = null;

  public title = 'Kviz opsteg znanja';

  ngOnInit(): void {
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
        this.router.navigate(['/dashboard']);
      }
    })
  }

  public onSubmit(){
    const data = {
      user: {
        email: this._loginDetails.email,
        password: this._loginDetails.password,
        roles: ['user']
      }
    }
    localStorage.setItem('db', JSON.stringify(data));
    this.router.navigate(['/dashboard']);
  }

  private _loginDetails = {
    email: '',
    password: ''
  }

}
