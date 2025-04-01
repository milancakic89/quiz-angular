import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Friend } from '../../../friends/types';
import { User } from '../../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-item',
  imports: [CommonModule],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
  standalone: true
})
export class UserItemComponent {
  @Output() onBtnClick = new EventEmitter<any>()

  @Input() user: User | Friend;

  @Input() btnLabel: string;

  @Input() online: boolean;

  @Input() showBtn = true;

  onAction(){
    this.onBtnClick.emit(this.user)
  }
}
