import { Component, OnInit } from '@angular/core';
import { QuestionService } from './questions.service';
import { DB, Question } from './types';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  constructor(private questionService: QuestionService) { }

  public questions: Question[] = []

  ngOnInit(): void {
    const db = this.questionService.getDB();
    this.questions = db.questions;
    this.questions.forEach(question =>{
      question.opened = false;
    })
  }

}
