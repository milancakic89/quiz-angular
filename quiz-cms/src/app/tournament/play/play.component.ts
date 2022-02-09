import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayService } from 'src/app/play/play.service';
import { Configuration } from 'src/app/shared/config.service';
import { SocketService } from 'src/app/socket-service';
import { TournamentService } from '../tournament.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  constructor(private socket: SocketService, 
              private route: ActivatedRoute,
              private playService: PlayService,
              private tournamentService: TournamentService,
              private router: Router,
              private config: Configuration){}

  get user(){ return this.config.user.getValue()}

  get room() { return this.tournamentService.room }
  set room(value) { this.tournamentService.room = value }

  public question: any;
  public questionSelected: any;
  public correct: any;
  public questionIndex = 1;
  public btnIndex = 0;
  public progressBarPercentage = 0;
  public answer: any;
  public time = 25;
  public showWaiting = false;
  public playersAnswered = 0;
  public totalPlayers = 0;
  public form = null;

  ngOnInit(): void {
    this.socketSetup()
    this.route.params.subscribe(params =>{
      if (params['id']){
        this.playService.allowBackButton = false;
        this.socket.emit('GET_ROOM_QUESTION', { roomName: this.room, questionIndex: this.questionIndex -1});
      }
    });

    
    
  }

  public socketSetup(){
    this.tournamentService.setupReady = true;
    this.socket.socketData.subscribe(data =>{
      if(data && data.event === 'UPDATE_WAITING_STATUS'){
        this.totalPlayers = data.users.length;
        data.users.forEach((user: any) =>{
          if(user.answered){
            this.playersAnswered++;
          }
        })
      }

      if(data && data.event === 'GET_ROOM_QUESTION'){
        this.question = data.question;
      }

      if(data && data.event === 'SELECTED_QUESTION_LETTER'){
       
        if(data.correct){
          this.correct = 2
        }else{
          this.correct = 1
        }
        setTimeout(() =>{
          this.showWaiting = true;
        }, 500)
        
      }

      if(data && data.event === 'EVERYONE_ANSWERED'){
        this.questionIndex++;
          setTimeout(()=>{
            this.question = null;
            this.totalPlayers = 0;
            this.playersAnswered = 0;
            this.questionSelected = null;
            this.correct = 0
            this.showWaiting = false;
            this.btnIndex = 0;
            console.log('happens: ' + this.room)
            this.socket.emit('GET_ROOM_QUESTION', { roomName: this.room, questionIndex: this.questionIndex - 1});
          },1000)
         
      }
      if(data && data.event === 'TOURNAMENT_FINISHED'){
        this.playService.allowBackButton = true;
        setTimeout(()=>{
          this.router.navigateByUrl(`/tournament/room/${this.room}/results`)
        },300)
         
      }

      //TOURNAMENT_FINISHED
    })
  }

  public onSelectedAnswer(answer: {letter: string, text: string}, id: string, index: number){
    this.questionSelected = answer;
    this.btnIndex = index;
    this.socket.emit('SELECTED_QUESTION_LETTER', { letter: answer.letter, roomName: this.room, user_id: this.user._id, questionIndex: this.questionIndex - 1})
  }

}
