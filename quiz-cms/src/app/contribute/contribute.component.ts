import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuestionService } from '../questions/questions.service';
import { Question } from '../questions/types';

type Correct = 'A' | 'B' | 'C' | 'D';
@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.scss']
})
export class ContributeComponent implements OnInit {

  constructor(private questionService: QuestionService) { }

  get newQuestion(){ return this._newQuestion}
  set newQuestion(value){ this._newQuestion = value}

  public items = ['A','B','C','D']

  public selected: Correct = 'A';

  ngOnInit(): void {
  }

  public onChange(){
    console.log(this.selected)
  }

  public onFormSubmit(form: NgForm){
    if(this._newQuestion.correct === 'A'){
      this.newQuestion.correct_answer_text = this._newQuestion.letter_a
    }
    if(this._newQuestion.correct === 'B'){
      this.newQuestion.correct_answer_text = this._newQuestion.letter_b
    }
    if(this._newQuestion.correct === 'C'){
      this.newQuestion.correct_answer_text = this._newQuestion.letter_c
    }
    if(this._newQuestion.correct === 'D'){
      this.newQuestion.correct_answer_text = this._newQuestion.letter_d
    }
    const question: Question = {
      answeredCorrect: 0,
      answeredWrong: 0,
      question_text: this._newQuestion.question_text,
      status: 'PRIHVACENO',
      answers: [
        {
          answer_text: this._newQuestion.letter_a,
          answer_letter: 'A',
        },
        {
          answer_text: this._newQuestion.letter_b,
          answer_letter: 'B',
        },
        {
          answer_text: this._newQuestion.letter_c,
          answer_letter: 'C',
        },
        {
          answer_text: this._newQuestion.letter_d,
          answer_letter: 'D',
        }
      ],
      correct_letter: this._newQuestion.correct,
      correct_text: this.newQuestion.correct_answer_text
    }

    this.questionService.addQuestionToDB(question);
    form.resetForm();
  }

  private _newQuestion = {
    question_text: '',
    correct_answer_text: '',
    letter_a: '',
    letter_b: '',
    letter_c: '',
    letter_d: '',
    correct: this.selected
  }

}
