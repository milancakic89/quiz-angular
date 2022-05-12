import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from 'src/app/questions/types';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'add-word-question',
  templateUrl: './add-word-question.component.html',
  styleUrls: ['./add-word-question.component.scss']
})
export class AddWordQuestionComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  get newQuestion() { return this._newQuestion }
  set newQuestion(value) { this._newQuestion = value }

  public step = 1;
  @Input() public categories: { title: string, value: any }[] = [];

  @Output() canceled = new EventEmitter();
  @Output() uploaded = new EventEmitter()

  ngOnInit(): void {}

  public nextStep() {
    if (this.step < 3) {
      this.step++;
    }
  }

  public stepBack() {
    if (this.step > 1) {
      this.step--;
    }
  }

  public cancel() {
    this.canceled.emit(true)
  }

  public checkDisabled() {
    if (!this._newQuestion.question_text) {
      return true;
    }
    if (!this._newQuestion.correct_text) {
      return true;
    }
    return false;
  }

  public addQuestion() {
    this.uploadQuestion();
  }


  private uploadQuestion() {
    const question: Question = {
      question: this._newQuestion.question_text,
      answers: [],
      type: 'WORD' ,
      category: 'RAZNO',
      correct_text: this.newQuestion.correct_text
    }
    this.socketService.emit('ADD_WORD_QUESTION', { question: question })
    this.uploaded.emit(true);
  }

  private _newQuestion = {
    question_text: '',
    correct_text: '',
    type: 'WORD',
    category: 'RAZNO'
  }

}
