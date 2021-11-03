import { Component, OnInit } from '@angular/core';
import { Configuration } from './shared/config.service';

export interface User{
  email?: string;
  password?: string;
  roles?: string[];
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'quiz-cms';

  constructor(private config: Configuration){}

  public user: any;

  ngOnInit(){
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
      }
    })
  }
}
