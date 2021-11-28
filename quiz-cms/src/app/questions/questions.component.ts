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

  get isRoot(){return this.config.isRoot}

  public questions: Question[] = []
  public user: any;
  public updateQuestion = '';
  public showUpdateButton = true;

  ngOnInit(): void {
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
      }
    })
    this.questionService.getQuestions().subscribe((data) =>{
      if(data){
        this.questions = data.data;
        localStorage.setItem('questions', JSON.stringify(data.data))
      }
     
    })
  }

  public updateQuestionText(id: string){
    this.showUpdateButton = false;
    this.questionService.updateQuestionText(id, this.updateQuestion).subscribe((data: any) =>{
      if(data && data.success){
        this.showUpdateButton = true;
        this.questions.forEach(question =>{
          if(question._id === id){
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
      }
    },
    error =>{
      this.showUpdateButton = true;
    })
  }

  public publish(id: string){
    this.questionService.publish(id).subscribe((data: any) =>{
      if(data && data.success){
        this.notificationService.notification.emit({
          success: true,
          message: 'Uspesno promenjeno.'
        })
        this.questions.forEach(question =>{
          if(question._id === id){
            question.status = 'ODOBRENO';
          }
        })
      }
    })
  }

  public unpublish(id: string){
    this.questionService.unpublish(id).subscribe((data: any) =>{
      console.log(data)
      if(data && data.success){
        this.notificationService.notification.emit({
          success: true,
          message: 'Uspesno promenjeno.'
        })
        this.questions.forEach(question =>{
          if(question._id === id){
            question.status = 'NA CEKANJU';
          }
        })
      }
    })

  }

  public onDeleteQuesion(id: string){
    this.questionService.deleteQuestion(id).subscribe((data: any) =>{
      if(data && data.success){
        this.notificationService.notification.emit({
          success: true,
          message: 'Uspesno obrisano.'
        })
        this.questions = this.questions.filter(q => q._id !== id)
      }
    })
  }


}
