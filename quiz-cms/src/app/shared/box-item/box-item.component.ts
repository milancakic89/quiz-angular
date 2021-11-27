import { Component, Input, OnInit } from '@angular/core';

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


  ngOnInit(): void {
  }

}
