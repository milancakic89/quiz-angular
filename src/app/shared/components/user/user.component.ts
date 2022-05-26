import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShopItem } from 'src/app/shop/types';
import { User } from '../../config.service';

type Components = 'name' | 'avatar' | 'score' | 'online' | 'delete' | 'info' | 'checkbox' | 'ranking' | 'bg-off' | 'user-click';
@Component({
  selector: 'user-item',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor() { }

  @Input() public user: User = null as unknown as  User;
  @Input() public showButton = true;
  @Input() public ranking: number = 0;
  @Input() public buttonText = 'buttonText';
  @Input() public showCheckbox = false;
  @Input() public showComponents: Components[] = [];
  @Input() public size: 'regular' | 'medium' = 'regular';

  public selected = false;
  public shopItem = ShopItem;

  @Output() public onButtonClick = new EventEmitter<User>();
  @Output() public onSelectedChange = new EventEmitter<boolean>()

  ngOnInit(): void {
  }

  public shouldShow(component: Components){
    return this.showComponents.includes(component)
  }

  public onSelectChange(){
    this.selected = !this.selected;
    this.onSelectedChange.emit(this.selected);
  }

}
