import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalWrapper } from './modal-service';
import { Configuration } from './shared/config.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'quiz-cms';

  constructor(private config: Configuration, private modal: ModalWrapper, private router: Router){}
  get isRoot(){return this.config.isRoot}
  get isLogged(){return this.config.logged}

  public user: any;
  public showModal = false;
  public gameRunning = false;


  ngOnInit(){
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
      }
    })
    if(localStorage.getItem('access') && !this.config.logged){
      this.config.attemptAutoLogin();
  }
    this.modal.openPlayModal.subscribe(bool =>{
        this.showModal = bool;
    });

    this.modal.startGame.subscribe(bool =>{
      this.gameRunning = bool;
  });

    if(this._initRedirect){
      this._initRedirect = false;
      this.router.navigateByUrl('');
      return;
    }

  }

  public play(){
    this.modal.openPlayModal.emit(true)
  }

  public closeModal(){
    this.gameRunning = true;
    this.modal.openPlayModal.emit(false)
    this.modal.startGame.emit(true);
  }

  public logout(){
    this.config.logout();
  }

  private _initRedirect = true;
}
