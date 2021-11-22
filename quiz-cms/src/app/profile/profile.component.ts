import { Component, OnInit } from '@angular/core';
import { initialQuestionsSetup } from '../questions/initial';
import { Configuration, User } from '../shared/config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private config: Configuration, private setup: initialQuestionsSetup) { }

  get isRoot(){return this.config.isRoot}

  public showContributionInfo = false;
  public imageUrl = 'https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.0/img/avatar.png';

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
      }
    })

    // console.log('here')
    // this.setup.cities();
    // setTimeout(() => {
    //   this.setup.init();
    // }, 1000)
  }
}
