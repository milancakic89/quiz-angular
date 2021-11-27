import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {

  constructor() { }

  public testAch = [
    {
     category: 'GEOGRAFIJA', 
     achiveText: '30 pogodjenih pitanja', 
     backgroundUrl: '../../assets/images/category/geography.jpeg'
    },
    {
      category: 'GEOGRAFIJA', 
      achiveText: '60 pogodjenih pitanja', 
      backgroundUrl: '../../assets/images/category/geography.jpeg'
     },
     {
      category: 'GEOGRAFIJA', 
      achiveText: '100 pogodjenih pitanja', 
      backgroundUrl: '../../assets/images/category/geography.jpeg'
     },
     {
      category: 'GEOGRAFIJA', 
      achiveText: '200 pogodjenih pitanja', 
      backgroundUrl: '../../assets/images/category/geography.jpeg'
     },
     {
      category: 'GEOGRAFIJA', 
      achiveText: '500 pogodjenih pitanja', 
      backgroundUrl: '../../assets/images/category/geography.jpeg'
     },
     //BREAK
     {
      category: 'ISTORIJA', 
      achiveText: '30 pogodjenih pitanja', 
      backgroundUrl: '../../assets/images/category/history.jpg'
     },
     {
       category: 'ISTORIJA', 
       achiveText: '60 pogodjenih pitanja', 
       backgroundUrl: '../../assets/images/category/history.jpg'
      },
      {
       category: 'ISTORIJA', 
       achiveText: '100 pogodjenih pitanja', 
       backgroundUrl: '../../assets/images/category/history.jpg'
      },
      {
       category: 'ISTORIJA', 
       achiveText: '200 pogodjenih pitanja', 
       backgroundUrl: '../../assets/images/category/history.jpg'
      },
      {
       category: 'ISTORIJA', 
       achiveText: '500 pogodjenih pitanja', 
       backgroundUrl: '../../assets/images/category/history.jpg'
      },
    
  ]

  ngOnInit(): void {
  }

}
