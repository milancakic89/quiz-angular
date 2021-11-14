import { Component, OnInit } from '@angular/core';
import { Configuration, User } from '../shared/config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private config: Configuration) { }

  public showContributionInfo = false;
  public imageUrl = '';

  public showInput = false;
  public user = null as unknown as User;

  public onChangeAvatar(){
    localStorage.setItem('avatar', this.imageUrl);
    this.showInput = false;
  }

  ngOnInit(): void {
    this.imageUrl = localStorage.getItem('avatar') || '';
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
        console.log(user)
      }
    })
  }

}
