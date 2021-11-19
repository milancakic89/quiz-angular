import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Feedback, FeedbackMessageService } from './feedback.service';
import { GameData, ModalWrapper } from './modal-service';
import { Configuration } from './shared/config.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Quiz';

  constructor(private config: Configuration, 
              private modal: ModalWrapper,
              private feedbackService: FeedbackMessageService,
              private router: Router){}
  get isRoot(){return this.config.isRoot}
  get isLogged(){return this.config.logged}

  public user: any;
  public showModal = false;
  public gameRunning = false;
  public feedbackClass = '';
  public feedbackMessage = 'test';
  public feedbackTimeInSeconds = 5;
  public spinner = true;
  public gameResults: GameData = {
    success: false,
    showModal: false,
    results: null
  };


  ngOnInit(){
    this.feedbackService.feedback.subscribe((feedback: Feedback) =>{
      this.feedbackClass = feedback.success.toString();
      this.feedbackMessage = feedback.message;
      this.clearFeedback();
    });

    if(!this.user && !localStorage.getItem('access')){
        this.spinner = false;
    }

    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
        this.spinner = false;
      }
    })
    if(localStorage.getItem('access') && !this.config.logged){
          this.config.attemptAutoLogin();
          setTimeout(()=>{
            this.spinner = false;
          }, 3000)
    }

  this.modal.gameResults.subscribe(gameData =>{
    if(gameData){
      this.gameRunning = false;
      this.modal.startGame.next(false);
      this.gameResults.noQuestions = gameData.noQuestions;
      this.gameResults.results = gameData.results;
      this.gameResults.showModal = gameData.showModal;
      this.gameResults.success = gameData.success;
      setTimeout(()=>{
        this.gameResults.noQuestions = false;
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

  public clearFeedback(){
    setTimeout(()=>{
        this.feedbackClass = '';
        this.feedbackMessage = '';
    }, this.feedbackTimeInSeconds * 1000)
  }

  public play(){
    this.showModal = true;
  }

  public logout(){
    this.config.logout();
  }

  private _initRedirect = true;
}
