import { Injectable } from "@angular/core";
import { DB, Question } from "./types";

@Injectable({providedIn: 'root'})
export class QuestionService{

    public getDB(): DB{
        let db;
        if(!localStorage.getItem('questions')){
            db = {
                questions:[
                  {
                    answeredCorrect: 0,
                    answeredWrong: 0,
                    question_text: 'Koje je boje pikachu',
                    correct_letter: 'C',
                    status: 'PRIHVACENO',
                    correct_text: 'Zute',
                    answers:[
                      {
                        answer_text: 'Plave',
                        answer_letter: 'A'
                      },
                      {
                        answer_text: 'Zelene',
                        answer_letter: 'B'
                      },
                      {
                        answer_text: 'Zute',
                        answer_letter: 'C'
                      },
                      {
                        answer_text: 'Roze',
                        answer_letter: 'D'
                      }
                    ]
                  },
                  {
                    answeredCorrect: 0,
                    answeredWrong: 0,
                    question_text: 'Ko se bori sa Musom Kesedzijom',
                    correct_letter: 'A',
                    status: 'NA CEKANJU',
                    correct_text: 'Kraljevic Marko',
                    answers:[
                      {
                        answer_text: 'Kraljevic Marko',
                        answer_letter: 'A'
                      },
                      {
                        answer_text: 'Green Lantern',
                        answer_letter: 'B'
                      },
                      {
                        answer_text: 'Crni Djordje',
                        answer_letter: 'C'
                      },
                      {
                        answer_text: 'Lich King',
                        answer_letter: 'D'
                      }
                    ]
                  },
                ]
              }    
              localStorage.setItem('questions', JSON.stringify(db));
        }else{
            db = JSON.parse(localStorage.getItem('questions') || '');
        }
        return db;
    }

    public addQuestionToDB(question: Question){
        const db: DB = JSON.parse(localStorage.getItem('questions') || '');
        db.questions.push(question)
        localStorage.setItem('questions', JSON.stringify(db));
    }
}