import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalWrapper } from './modal-service';
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

  constructor(private config: Configuration, private modal: ModalWrapper, private router: Router){}

  public user: any;
  public showModal = false;

  ngOnInit(){
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
      }
    })
    this.modal.openPlayModal.subscribe(bool =>{
        this.showModal = bool;
    })
  }

  public play(){
    this.modal.openPlayModal.emit(true)
  }

  public closeModal(){
    this.modal.openPlayModal.emit(false)
  }
}
