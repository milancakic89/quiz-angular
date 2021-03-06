import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type Theme = 'blue' | 'yellow' | 'braon';

@Component({
  selector: 'box-item',
  templateUrl: './box-item.component.html',
  styleUrls: ['./box-item.component.scss']
})
export class BoxItemComponent implements OnInit {

  constructor() { }

  @Input() description = '';
  @Input() backgroundUrl = '';
  @Input() title = '';
  @Input() theme: Theme = 'blue';
  @Input() class = '';
  @Input() answered = 0;
  @Input() achivedAt = 0;
  @Input() completed: any;
  
  public displayGray = false;

  @Output() onClick = new EventEmitter<any>();


  ngOnInit(): void {
   this.completed = 100 - (100 * (this.answered / this.achivedAt));
   if(this.completed > 0){
      this.displayGray = true;
   }
  }

}
