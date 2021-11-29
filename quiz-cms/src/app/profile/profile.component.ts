import { Component, OnInit } from '@angular/core';
import { PlayService } from '../play/play.service';
import { Configuration, User } from '../shared/config.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private config: Configuration,
              private playService: PlayService,
              private service: ProfileService) { }

  get isRoot(){return this.config.isRoot}

  public showContributionInfo = false;
  public imageUrl = 'https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.0/img/avatar.png';

  public showInput = false;
  public user = null as any as User;

  public gameLeaved = false;

  public name = '';
  public showNameBox = false;

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
    setTimeout(()=>{
      const leaved = JSON.parse(sessionStorage.getItem('play-mode') || '');
      if (leaved) {
        this.gameLeaved = true;
        setTimeout(()=>{
          sessionStorage.setItem('play-mode', 'false');
          this.gameLeaved = false;
          this.reduceOneLife();
        }, 5000)
       
      }
    }, 500)
  }

  public closeNameBox(){
    setTimeout(()=>{
      this.showNameBox = false
    }, 10)
  }

  public async updateName(){
    if(!this.name.length){
      return;
    }
    const { success } = await this.service.updateName(this.name);
    if(success){
      this.user.name = this.name;
    }
    this.closeNameBox()
  }

  public async onResetLives(){
    const { data, success } = await this.service.resetLives()
    if(success){
      console.log(data);
      this.config.user.next(data);
    }
  }

  public async reduceOneLife() {
    sessionStorage.setItem('play-mode', 'true');
    const { data, success } = await this.playService.reduceOneLife()
    if (success) {
      this.config.user.next(data)
    }
  }

}
