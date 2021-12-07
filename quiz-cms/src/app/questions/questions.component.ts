import { Component, OnInit } from '@angular/core';
import { Configuration, User } from '../shared/config.service';
import { NotificationService } from '../shared/notification.service';
import { QuestionService } from './questions.service';
import { Question } from './types';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  constructor(private questionService: QuestionService,
    private notificationService: NotificationService,
    private config: Configuration) { }

  get isRoot() { return this.config.isRoot }

  public questions: Question[] = []
  public user: any;
  public updateQuestion = '';
  public showUpdateButton = true;

  public filters = [
    { title: 'SVE', value: '' },
    { title: 'GEOGRAFIJA', value: 'GEOGRAFIJA' },
    { title: 'ISTORIJA', value: 'ISTORIJA' },
    { title: 'POZNATE LICNOSTI', value: 'POZNATE LICNOSTI' },
    { title: 'MUZIKA', value: 'MUZIKA' },
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
    this.load();
  }

  public async load() {
    const { data, success } = await this.questionService.getQuestions(this.selectedFilter);
    if (success) {
      this.questions = data;
      console.log(data)
      localStorage.setItem('questions', JSON.stringify(data))
    }
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
