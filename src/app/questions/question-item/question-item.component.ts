import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Configuration } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocketService } from 'src/app/socket-service';
import { Question } from '../types';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, 
              private socketService: SocketService,
              private router: Router,
              private config: Configuration,
              private notifications: NotificationService) { }

  get root(){return this.config.isRoot}
  
  get admin(){ return this.question.posted_by === this.config.user._id}

  public question: Question = null as unknown as Question;
  public denyReason = '';

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      if(params['id']){
        this._id = params['id'];
        this.load();
      }
    });

    this.subscription = this.socketService.socketData.subscribe(data =>{
      if(data && data.event === 'LOAD_SINGLE_QUESTION'){
          this.question = data.data;
      }
      if (data && data.event === 'DELETE_QUESTION') {
        this.notifications.notification.emit({ message: 'Pitanje obrisano', success: true });
        this.router.navigateByUrl('/questions')
      }
      if (data && data.event === 'PUBLISH_QUESTION') {
        this.question.status = 'ODOBRENO';
        this.notifications.notification.emit({message: 'Pitanje je sada javno', success: true});
      }
      if (data && data.event === 'UNPUBLISH_QUESTION') {
        this.question.status = 'ODBIJENO';
        this.notifications.notification.emit({ message: 'Pitanje je odbijeno', success: true });
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }

  public load(){
    this.socketService.emit('LOAD_SINGLE_QUESTION', { question_id: this._id});
  }

  public publishQuestion(){
    if(this.question.status === 'ODOBRENO'){
      return this.notifications.notification.emit({ message: 'Pitanje je vec odobreno', success: true });
    }
      this.socketService.emit('PUBLISH_QUESTION', {question_id: this._id})
  }

  public unpublishQuestion() {
    this.socketService.emit('UNPUBLISH_QUESTION', { question_id: this._id, deny_reason: this.denyReason })
  }

  public deleteQuestion(){
    this.socketService.emit('DELETE_QUESTION', {question_id: this._id});
  }

  private _id = '';
  private subscription: Subscription = null as unknown as Subscription;
}
