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

  public questions: Question[] = []
  public user: any;

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

  public onDeleteQuesion(id: string){
    this.questionService.deleteQuestion(id).subscribe((data: any) =>{
      if(data){
        console.log(data)
        this.questions = this.questions.filter(q => q._id !== id)
      }
    })
  }


}
