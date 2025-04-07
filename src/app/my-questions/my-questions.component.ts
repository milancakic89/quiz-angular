import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { EVENTS } from '../events';
import { filter, map, tap } from 'rxjs/operators';
import { QuestionItemComponent } from '../shared/components/question-item/question-item.component';
import { Question } from '../types';

@Component({
  selector: 'app-my-questions',
  imports: [CommonModule, QuestionItemComponent],
  standalone: true,
  templateUrl: './my-questions.component.html',
  styleUrl: './my-questions.component.scss'
})
export class MyQuestionsComponent implements OnInit{

  socketService = inject(SocketService);

  questions$ = this.socketService.messages$.pipe(
    filter(socketData => socketData.event === EVENTS.GET_QUESTIONS),
    map(socketData => socketData.data as Question[])
  );

  trackIndex(index: number){
    return index;
  }

  ngOnInit(): void {
    this.socketService.sendMessage({
      event: EVENTS.GET_QUESTIONS
    })
  }
}
