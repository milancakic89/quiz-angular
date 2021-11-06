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
    const db = this.questionService.getDB();
    this.questions = db.questions;
    this.questions.forEach(question =>{
      question.opened = false;
    })
  }


}
