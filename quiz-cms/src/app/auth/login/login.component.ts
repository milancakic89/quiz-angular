import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration } from 'src/app/shared/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private config: Configuration, private router: Router) { }

  get login() { return this._loginDetails; }
  get isRoot(){ return this.config.isRoot}
  
  public user = null;
  public title = 'Kviz opsteg znanja';

  ngOnInit(): void {
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
        console.log(user)
        this.router.navigate(['/profile']);
      }
    })
  }

  public async onSubmit(){
   await this.config.getUser(this._loginDetails.email, this._loginDetails.password)
  }

  private _loginDetails = {
    email: '',
    password: ''
  }

}
