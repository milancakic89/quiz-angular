import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../config.service';

@Component({
  selector: 'user-item',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor() { }

  @Input() public user: User = null as unknown as  User;
  @Input() public showButton = true;
  @Input() public buttonText = 'buttonText';
  @Input() public showCheckbox = false;

  public selected = false;
  

  @Output() public onButtonClick = new EventEmitter<User>();
  @Output() public onSelectedChange = new EventEmitter<boolean>()

  ngOnInit(): void {
  }

  public onSelectChange(){
    this.selected = !this.selected;
    this.onSelectedChange.emit(this.selected);
  }

}
