import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Configuration, User } from '../shared/config.service';
import { NotificationService } from '../shared/notification.service';
import { SocketService } from '../socket-service';
import { QuestionService } from './questions.service';
import { Category, Question, QuestionStatus } from './types';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {

  constructor(private questionService: QuestionService,
    private notificationService: NotificationService,
    private socketService: SocketService,
    private config: Configuration) { }

  get isRoot() { return this.config.isRoot }

  public questions: Question[] = [];
  public user: any;
  public updateQuestion = '';
  public showUpdateButton = true;
  public filterStatus = '';
  public mixed: Question[] = [] as unknown as Question[];
  public uploadCounter = 0;
  public subscription: Subscription = null as unknown as Subscription;

  public filters = [
    { title: 'SVE', value: '' },
    { title: 'GEOGRAFIJA', value: 'GEOGRAFIJA' },
    { title: 'ISTORIJA', value: 'ISTORIJA' },
    { title: 'POZNATE LICNOSTI', value: 'POZNATE LICNOSTI' },
    { title: 'MUZIKA', value: 'MUZIKA' },
    { title: 'FILMOVI I SERIJE', value: 'FILMOVI I SERIJE' },
    { title: 'SPORT', value: 'SPORT' },
    { title: 'RAZNO', value: 'RAZNO' },
  ];
  public selectedFilter = '';

  ngOnInit(): void {
    this.config.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    })
    this.subscription = this.socketService.socketData.subscribe(data =>{
      if(data && data.event === 'GET_QUESTIONS'){
        if(this.filterStatus){
          this.questions = data.data.filter((item: Question) => item.status === this.filterStatus);;
        }else{
          this.questions = data.data;
        }
        localStorage.setItem('questions', JSON.stringify(data))
      }
    })
    this.load();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  public load() {
    this.socketService.emit('GET_QUESTIONS', { filter: this.selectedFilter})
  }

  public async filter(status: QuestionStatus){
    this.filterStatus = status;
    this.socketService.emit('GET_QUESTIONS', { filter: this.selectedFilter })
  }

  public async updateQuestionText(id: string) {
    this.showUpdateButton = false;
    const { success } = await this.questionService.updateQuestionText(id, this.updateQuestion);
    if (success) {
      this.showUpdateButton = true;
      this.questions.forEach(question => {
        if (question._id === id) {
          question.question = this.updateQuestion;
          question.status = 'NA CEKANJU';
          this.updateQuestion = '';
          question.opened = false;
          this.notificationService.notification.emit({
            success: true,
            message: 'Uspesno promenjeno.'
          })
        }
      })
    } else {
      this.showUpdateButton = true;
    }
  }

  public async publish(id: string) {
    const { data, success } = await this.questionService.publish(id)
    if (success) {
      this.notificationService.notification.emit({
        success: true,
        message: 'Uspesno promenjeno.'
      });
      this.questions.forEach(question => {
        if (question._id === id) {
          question.status = 'ODOBRENO';
        }
      })
    }
  }

  public async unpublish(id: string) {
    const { data, success } = await this.questionService.unpublish(id)
    if (success) {
      this.notificationService.notification.emit({
        success: true,
        message: 'Uspesno promenjeno.'
      })
      this.questions.forEach(question => {
        if (question._id === id) {
          question.status = 'NA CEKANJU';
        }
      })
    }
  }

  public async onDeleteQuesion(id: string) {
    const { success } = await this.questionService.deleteQuestion(id);
    if (success) {
      this.notificationService.notification.emit({
        success: true,
        message: 'Uspesno obrisano.'
      })
      this.questions = this.questions.filter(q => q._id !== id)
    }
  }

}
