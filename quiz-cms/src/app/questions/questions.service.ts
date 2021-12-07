import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";
import { Configuration } from "../shared/config.service";
import { DB, Question } from "./types";

@Injectable({providedIn: 'root'})
export class QuestionService{

  constructor(private service: ApiService){}

  public getQuestions(filter: string){
    if(filter){
      return this.service.get<Question[]>(`/all-questions/${filter}`, 'Ucitavanje pitanja nije uspelo');
    }
    return this.service.get<Question[]>(`/all-questions`, 'Ucitavanje pitanja nije uspelo');
  }

  public getSingleQuestion(){
    return this.service.get<Question>('/question', 'Neuspelo preuzimanje pitanja.');
  }

  public addQuestion(question: any){
    return this.service.post<any>('/add-question', question, 'Neuspelo dodavanje pitanja.');
  }

  public addImageQuestion(question: any) {
    return this.service.post<any>('/image-question', question, 'Neuspelo dodavanje pitanja.');
  }

  public deleteQuestion(id: any | string){
    return this.service.delete<any>('/delete-question/' + id, {}, 'Neuspelo brisanje pitanja')
  }

  public publish(id: string){
    return this.service.post<any>('/publish', {id}, 'Objavljivanje nije uspelo.');
  }

  public unpublish(id: string){
    return this.service.post<any>('/unpublish', {id}, 'Objavljivanje nije uspelo');
  }

  public updateQuestionText(id: string, text: string){
    return this.service.post<any>('/update-question-text', {id, text}, 'Neuspesno menjanje pitanja');
  }
//update-question-text
}