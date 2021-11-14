import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameData, ModalWrapper } from './modal-service';
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
  public gameResults: GameData = {
    success: false,
    showModal: false,
    results: null
  };


  ngOnInit(){
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
      }
    })
    if(localStorage.getItem('access') && !this.config.logged){
      this.config.attemptAutoLogin();
  }

  this.modal.gameResults.subscribe(gameData =>{
    if(gameData){
      this.gameRunning = false;
      this.modal.startGame.next(false);
      this.gameResults.results = gameData.results;
      this.gameResults.showModal = gameData.showModal;
      this.gameResults.success = gameData.success;
      setTimeout(()=>{
        this.gameResults.showModal = false;
        this.gameResults.results = null;
        this.gameResults.success = false;
        this.router.navigateByUrl('/profile')
      }, 2000)
    }
   
  })

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
    this.showModal = true;
  }

  public logout(){
    this.config.logout();
  }

  private _initRedirect = true;
}
