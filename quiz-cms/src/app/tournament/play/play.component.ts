import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Configuration } from 'src/app/shared/config.service';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  constructor(private socket: SocketService, private route: ActivatedRoute, private config: Configuration){}

  get user(){ return this.config.user.getValue()}

  public question: any;
  public questionSelected: any;
  public correct: any;
  public questionCount = 0;
  public btnIndex = 0;
  public progressBarPercentage = 0;
  public answer: any;
  public time = 25;
  private room = '';
  public showWaiting = false;
  public playersAnswered = 0;
  public totalPlayers = 0;

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      if(params['id']){
        this.room = params['id'];
        this.socket.emit('START_TOURNAMENT_QUESTION', {roomName: this.room});
      }
    });

    this.socket.socketData.subscribe(data =>{
      if(data && data.event === 'START_TOURNAMENT_QUESTION'){
        this.question = data.question
      }

      if(data && data.event === 'UPDATE_WAITING_STATUS'){
        this.totalPlayers = data.users.length;
        data.users.forEach((user: any) =>{
          if(user.answered){
            this.playersAnswered++;
          }
        })
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
    })
    
  }

  public onSelectedAnswer(answer: {letter: string, text: string}, id: string, index: number){
    this.questionSelected = answer;
    this.btnIndex = index;
    this.socket.emit('SELECTED_QUESTION_LETTER', {letter: answer.letter, roomName: this.room, user_id: this.user._id})
  }


}
