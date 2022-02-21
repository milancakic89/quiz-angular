import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration, User } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UploadService } from 'src/app/upload.service';
import { SettingsService } from '../settings.service';

export interface Settings{
  name: string;
  image: any;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  constructor(private router: Router,
              private notifications: NotificationService,
              private uploadService: UploadService,
              private service: SettingsService,
              private config: Configuration) { }

  get settings(){ return this._settings}
  set settings(value: Settings){ this._settings = value}

  get user () { return this.config.user.getValue() as User}

  public selectedImage = null

  @ViewChild('upload') public upload: any;


  ngOnInit(): void {
    this._settings.name = this.user.name;
    this._settings.image = this.user.avatar_url;
  }

  public backToProfile() {
    this.router.navigateByUrl('/profile')
  }

  public onImageChange(){
    this._settings.image = this.upload.nativeElement.files[0];
  }


  public async onFormSubmit(){
    let imageUrl = null;
    if(this.selectedImage){
      imageUrl = await this.uploadService.uploadImage(this._settings.image)
      this._settings.image = imageUrl;
    }
    const { success, error } = await this.service.saveSettings(this._settings)
    if(success){
      this.notifications.notification.emit({success: true, message: 'Uspesno sacuvano'})
      this.user.avatar_url = this.settings.image
    }
  }

  private _settings: Settings = {
    name: '',
    image: null,
  }
}
