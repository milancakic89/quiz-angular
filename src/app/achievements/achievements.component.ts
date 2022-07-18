import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Configuration } from '../shared/config.service';
import { NotificationService } from '../shared/notification.service';
import { SocketService } from '../socket-service';
import { AchievementsService } from './achievements.service';

export interface Achievement{
  category: string;
  achiveText: string;
  achievedAt: number;
  answered: number;
  price_received: boolean;
}

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {

  constructor(private config: Configuration, private socketService: SocketService) { }

  get user(){return this.config.user}

  public achievements: Achievement[] = [];

  ngOnInit(): void {
    this.socketService.socketData.subscribe(data =>{
      if(data && data.event === 'GET_ACHIEVEMENTS'){
              this.achievements = data.data;
              this.achievements.sort();
      }
    })
    this.load();
  }

  public async load(){
    this.socketService.emit('GET_ACHIEVEMENTS', {})
  }

}
