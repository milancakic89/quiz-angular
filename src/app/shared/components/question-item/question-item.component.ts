import { Component, Input } from '@angular/core';
import { Question } from '../../../types';
import { CommonModule } from '@angular/common';
import { TrimPipe } from '../../pipes/trim.pipe';

@Component({
  selector: 'app-question-item',
  imports: [CommonModule, TrimPipe],
  templateUrl: './question-item.component.html',
  styleUrl: './question-item.component.scss'
})
export class QuestionItemComponent{
  @Input() question: Question;
  @Input() index: number;
}
