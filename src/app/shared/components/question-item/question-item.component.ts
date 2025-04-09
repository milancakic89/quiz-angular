import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Question } from '../../../types';
import { CommonModule } from '@angular/common';
import { TrimPipe } from '../../pipes/trim.pipe';
import { SocketService } from '../../../socket.service';
import { EVENTS } from '../../../events';
import { filter, Subscription } from 'rxjs';
import { NotificationService } from '../../notifications.service';

@Component({
  selector: 'app-question-item',
  imports: [CommonModule, TrimPipe],
  templateUrl: './question-item.component.html',
  styleUrl: './question-item.component.scss'
})
export class QuestionItemComponent implements OnInit, OnDestroy{
  private _socketService = inject(SocketService);
  private _notificationSErvice = inject(NotificationService);
  @Input() question: Question;
  @Input() index: number;

  @Input() admin = false;

  @Output() updated = new EventEmitter()

  messageSubscription: Subscription;

  ngOnInit(): void {
    this.messageSubscription = this._socketService.messages$.pipe(
      filter(socketData => socketData.event === EVENTS.PUBLISH_QUESTION || socketData.event === EVENTS.UNPUBLISH_QUESTION)
    ).subscribe(_ => {
      this._notificationSErvice.showMessage({
        type: 'SUCCESS',
        message: 'Question updated'
      })
    })
  }

  approve(){
    this._socketService.sendMessage({
      event: EVENTS.PUBLISH_QUESTION,
      question_id: this.question._id
    })
    this.updated.emit()
  }

  decline(){
    this._socketService.sendMessage({
      event: EVENTS.UNPUBLISH_QUESTION,
      question_id: this.question._id
    })
    this.updated.emit()
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }
}
