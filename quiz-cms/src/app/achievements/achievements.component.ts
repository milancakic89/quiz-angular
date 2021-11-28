import { Component, OnInit } from '@angular/core';
import { Configuration } from '../shared/config.service';
import { AchievementsService } from './achievements.service';

interface Achievement{
  category: string;
  achiveText: string;
  achievedAt: number;
}

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {

  constructor(private config: Configuration, private service: AchievementsService) { }

  public user: any = null;

  public achievements: Achievement[] = [];

  ngOnInit(): void {
    this.config.user.subscribe((user: any) =>{
      this.user = user;
      console.log(this.user)
    })

    this.service.getAchievements().subscribe((data: any) =>{
      if(data && data.success){
        this.achievements = data.achievements;
        console.log(this.achievements)
      }
    })
  }

}
