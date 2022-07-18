import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration, User } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocketService } from 'src/app/socket-service';
import { UploadService } from 'src/app/upload.service';
import { SettingsService } from '../settings.service';
import { environment } from 'src/environments/environment';
import { ShopItem } from 'src/app/shop/types';

export interface Settings{
  name: string;
  image: any;
  avatar_border?: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  constructor(private router: Router,
              private notifications: NotificationService,
              private socketService: SocketService,
              private uploadService: UploadService,
              private service: SettingsService,
              private config: Configuration) { }

  get settings(){ return this._settings}
  set settings(value: Settings){ this._settings = value}

  get user () { return this.config.user}

  public selectedImage = null;
  public shopItem = ShopItem;

  @ViewChild('upload') public upload: any;


  ngOnInit(): void {
    this._settings.name = this.user.name;
    this._settings.image = this.user.avatar_url;
    this._settings.avatar_border = this.user.avatar_border
  }

  public trackByFn(i: number){
    return i;
  }

  public selectAvatar(item: string, i: number){
    this.settings.avatar_border = item;
  }

  // public backToProfile() {
  //   this.router.navigateByUrl('/profile')
  // }

  public onImageChange(){
    this._settings.image = this.upload.nativeElement.files[0];
  }


  public async onFormSubmit(){
    let imageUrl = null;
    if(this.selectedImage){
      imageUrl = await this.uploadService.uploadImage(this._settings.image)
      this._settings.image = imageUrl;
    }
    this.socketService.emit('UPDATE_SETTINGS', { settings: this._settings })
   

  }

  public logout(){
    localStorage.clear();
    this.config.user = null;
    this.config.logged = false;
    setTimeout(() =>{
      this.router.navigateByUrl('')
    },10)
    
  }

  private _settings: Settings = {
    name: '',
    image: null,
    avatar_border: ''
  }
}
