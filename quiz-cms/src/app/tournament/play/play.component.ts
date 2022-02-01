import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  public question: any;
  public questionSelected: any;
  public correct: any;
  public questionCount = 0;
  public btnIndex = 0;
  public progressBarPercentage = 0;
  public answer: any;
  public time = 25;

  constructor() { }

  ngOnInit(): void {
  }

  public onSelectedAnswer(answer: string, id: string, index: number){}

}
