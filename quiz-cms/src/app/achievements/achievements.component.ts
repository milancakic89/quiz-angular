import { Component, OnInit } from '@angular/core';
import { Configuration } from '../shared/config.service';
import { NotificationService } from '../shared/notification.service';
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

  constructor(private config: Configuration, 
              private service: AchievementsService, 
              private notificationService: NotificationService) { }

  public user: any = null;

  public achievements: Achievement[] = [];

  ngOnInit(): void {
    this.config.user.subscribe((user: any) =>{
      this.user = user;
      console.log(this.user)
    })
    this.load();
  }

  public async load(){
    const { data, success} = await this.service.getAchievements();
    if(success){
      console.log(data)
      this.achievements = data;
    }
  }

}
