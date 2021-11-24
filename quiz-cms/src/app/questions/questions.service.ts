import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";
import { Configuration } from "../shared/config.service";
import { DB, Question } from "./types";

@Injectable({providedIn: 'root'})
export class QuestionService{

  constructor(private service: ApiService){}

  public getQuestions(){
    return this.service.get('/all-questions');
  }

  public getSingleQuestion(){
    return this.service.get('/question');
  }

  public addQuestion(question: any){
    return this.service.post('/add-question', question);
  }

  public deleteQuestion(id: any | string){
      return this.service.delete('/delete-question/' + id, {})
  }

  public publish(id: string){
    return this.service.post('/publish', {id});
  }

  public unpublish(id: string){
    return this.service.post('/unpublish', {id});
  }

  public updateQuestionText(id: string, text: string){
    return this.service.post('/update-question-text', {id, text});
  }
//update-question-text
}