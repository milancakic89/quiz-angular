import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from 'src/app/questions/types';
import { SocketService } from 'src/app/socket-service';

export type Letter = 'A' | 'B' | 'C' | 'D';
@Component({
  selector: 'add-question-stepper',
  templateUrl: './add-question-stepper.component.html',
  styleUrls: ['./add-question-stepper.component.scss']
})
export class AddQuestionStepperComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  get newQuestion() { return this._newQuestion }
  set newQuestion(value) { this._newQuestion = value }

  public step = 1;
  @Input() public categories: {title: string, value: any}[] = [];

  @Output() canceled = new EventEmitter();
  @Output() uploaded = new EventEmitter()

  public selectedCategory = null as any;
  public question_text = '';
  public correct = '';
  public incorect = {
    one: '',
    two: '',
    three: ''
  }

  ngOnInit(): void {
    this.selectedCategory = this.categories[0].title;
  }

  public nextStep(){
    if(this.step < 3){
      this.step++;
    }
  }

  public stepBack(){
    if(this.step > 1){
      this.step--;
    }
  }

  public cancel(){
    this.canceled.emit(true)
  }

  public onAddCategory(category: Letter){
    console.log(category)
    this._newQuestion.category = category;
  }

  public checkDisabled(){
    if(this.step === 1 && !this.selectedCategory){
      return true;
    }
    if(this.step === 2 && (!this.newQuestion.question_text || !this.newQuestion.correct_text)){
      return true;
    }
    if(this.step === 3 && (!this.incorect.one || !this.incorect.two || !this.incorect.three)){
      return true;
    }
    return false;
  }

  public addQuestion(){
    this._newQuestion.category = this.selectedCategory;
    const letters: Letter[] = ['A', 'B', 'C', 'D'];
    const rnd = Math.abs(Math.round(Math.random() * letters.length - 1))
    const correct = letters[rnd];
    this.generateLetters(correct);
    this.uploadQuestion();
  }

  public generateLetters(correct: Letter){
    switch(correct){
      case 'A':
        this._newQuestion.correct = 'A';
        this._newQuestion.letter_a = this._newQuestion.correct_text;
        this.newQuestion.letter_b = this.incorect.one;
        this.newQuestion.letter_c = this.incorect.two;
        this.newQuestion.letter_d = this.incorect.three;
        break;
      case 'B':
        this._newQuestion.correct = 'B';
        this._newQuestion.letter_b = this._newQuestion.correct_text;
        this.newQuestion.letter_a = this.incorect.one;
        this.newQuestion.letter_c = this.incorect.two;
        this.newQuestion.letter_d = this.incorect.three;
        break;
      case 'C':
        this._newQuestion.correct = 'C';
        this._newQuestion.letter_c = this._newQuestion.correct_text;
        this.newQuestion.letter_b = this.incorect.one;
        this.newQuestion.letter_a = this.incorect.two;
        this.newQuestion.letter_d = this.incorect.three;
        break;
      case 'D':
        this._newQuestion.correct = 'D';
        this._newQuestion.letter_d = this._newQuestion.correct_text;
        this.newQuestion.letter_b = this.incorect.one;
        this.newQuestion.letter_c = this.incorect.two;
        this.newQuestion.letter_a = this.incorect.three;
        break;
    }
  }

  private uploadQuestion(){
    const question: Question = {
      question: this._newQuestion.question_text,
      imageUrl: '',
      answers: [
        {
          text: this._newQuestion.letter_a,
          letter: 'A',
        },
        {
          text: this._newQuestion.letter_b,
          letter: 'B',
        },
        {
          text: this._newQuestion.letter_c,
          letter: 'C',
        },
        {
          text: this._newQuestion.letter_d,
          letter: 'D',
        }
      ],
      type: 'REGULAR',
      category: this.selectedCategory,
      correct_letter: this.newQuestion.correct,
      correct_text: this.newQuestion.correct_text
    }
    this.socketService.emit('ADD_QUESTION', { question: question })
    this.uploaded.emit(true);
  }

  private _newQuestion = {
    question_text: '',
    correct_text: '',
    image: null as any,
    category: '',
    letter_a: '',
    letter_b: '',
    letter_c: '',
    letter_d: '',
    correct: ''
  }

}
