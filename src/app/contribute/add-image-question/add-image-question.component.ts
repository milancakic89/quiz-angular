import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Question } from 'src/app/questions/types';
import { SocketService } from 'src/app/socket-service';
import { Letter } from '../add-question-stepper/add-question-stepper.component';
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'add-image-question',
  templateUrl: './add-image-question.component.html',
  styleUrls: ['./add-image-question.component.scss']
})
export class AddImageQuestionComponent implements OnInit {
  constructor(private socketService: SocketService, private storage: AngularFireStorage,) { }

  get newQuestion() { return this._newQuestion }
  set newQuestion(value) { this._newQuestion = value }

  @ViewChild('upload') public upload: any;

  public step = 1;
  @Input() public categories: { title: string, value: any }[] = [];

  @Output() canceled = new EventEmitter();
  @Output() uploaded = new EventEmitter()

  public selectedCategory = null as any;
  public selectedImage = null;
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

  public onAddCategory(category: Letter) {
    console.log(category)
    this._newQuestion.category = category;
  }

  public checkDisabled() {
    if (this.step === 1 && !this.selectedCategory) {
      return true;
    }
    if (this.step === 2 && (!this.selectedImage || !this.newQuestion.correct_text)) {
      return true;
    }
    if (this.step === 3 && (!this.incorect.one || !this.incorect.two || !this.incorect.three)) {
      return true;
    }
    return false;
  }

  public addQuestion() {
    this._newQuestion.category = this.selectedCategory;
    const letters: Letter[] = ['A', 'B', 'C', 'D'];
    const rnd = Math.abs(Math.round(Math.random() * letters.length - 1))
    const correct = letters[rnd];
    this.generateLetters(correct);
    this.uploadQuestion();
  }

  public onImageChange() {
    this._newQuestion.image = this.upload.nativeElement.files[0];
  }

  public generateLetters(correct: Letter) {
    switch (correct) {
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

  private uploadQuestion() {
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

    const filePath = Date.now() + this._newQuestion.image.name;
    const fileRef = this.storage.ref(filePath)
    this.storage.upload(filePath, this._newQuestion.image)
      .snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: any) => {
            const imageUrl = url.split('&token')[0];
            question.imageUrl = imageUrl;
            question.firebasePath = filePath;
              this.socketService.emit('ADD_QUESTION', { question: question })
              this.uploaded.emit(true);
          });
        })
      )
      .subscribe()
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
