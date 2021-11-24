import { Component, OnInit } from '@angular/core';
import { Configuration, User } from '../shared/config.service';
import { QuestionService } from './questions.service';
import { Question } from './types';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  constructor(private questionService: QuestionService, private config: Configuration) { }

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
      console.log(data)
      if(data && data.success){
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
      if(data){
        console.log(data)
        this.questions = this.questions.filter(q => q._id !== id)
      }
    })
  }


}
