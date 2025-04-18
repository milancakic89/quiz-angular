import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Answer } from '../types';
import { SocketService } from '../socket.service';
import { EVENTS } from '../events';
import { filter, tap } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

type Category = 'RAZNO' | 'MUZIKA' | 'FILMOVI I SERIJE' | 'GEOGRAFIJA' | 'ISTORIJA' | 'SPORT' | null;

@Component({
  selector: 'app-add-question',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.scss'
})
export class AddQuestionComponent implements OnInit, OnDestroy{
  private _questionType$ = new BehaviorSubject<'IMAGE' | 'TEXT'>('TEXT');

  @ViewChild('categoryItem') categoryEl: ElementRef;

  formBuilder = inject(FormBuilder);
  socketService = inject(SocketService)

  user$ = this.socketService.user$;

  categories = ['RAZNO', 'MUZIKA', 'FILMOVI I SERIJE', 'GEOGRAFIJA', 'ISTORIJA', 'SPORT']

  type = 'TEXT';
  lock = false;

  questionType$ = this._questionType$.asObservable();

  formSubscription: Subscription;

  questionForm = this.formBuilder.group({
    type: new FormControl<'TEXT' | 'IMAGE'>('TEXT', Validators.required),
    category: new FormControl<Category>('RAZNO', Validators.required),
    imageUrl: new FormControl(''),
    question: new FormControl(''),
    correct: new FormControl('', Validators.required),
    wrongOne: new FormControl('', Validators.required),
    wrongTwo: new FormControl('', Validators.required),
    wrongThree: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.socketService.messages$.pipe(
      filter(socketData => socketData.event === EVENTS.ADD_QUESTION)
    ).subscribe(_ => this.questionForm.reset());

    this.formSubscription =  this.questionForm.valueChanges.pipe(
    ).subscribe(changes => {
      if(changes.type !== this._questionType$.value){
        this._questionType$.next(changes.type);
      }
    });
  }

  onSubmit() {
    const { type, imageUrl ,question, correct, wrongOne, wrongTwo, wrongThree } = this.questionForm.value;

    this.user$.subscribe(user => {
      const questionText = question;
      const correctText = correct;
      const category = 'RAZNO';
      let shuffled = this.shuffle(['A', 'B', 'C', 'D']);
      const correct_letter = shuffled[0];
      shuffled = shuffled.filter(item => item !== correct_letter)
      const allAnswers: Answer[] = [
        {
          text: questionText,
          letter: correct_letter
        },
        {
          text: wrongOne,
          letter: shuffled[0]
        },
        {
          text: wrongTwo,
          letter: shuffled[1]
        },
        {
          text: wrongThree,
          letter: shuffled[2]
        },

      ];

      const _question = {
        question: questionText,
        correct_letter: correct_letter,
        correct_text: correctText,
        posted_by: user._id,
        category: category,
        answers: allAnswers.sort((a, b) => a.letter.localeCompare(b.letter)),
        imageUrl: imageUrl,
        type: type,
        status: 'NA CEKANJU'
      };
      this.socketService.sendMessage({
        event: EVENTS.ADD_QUESTION,
        question: _question
      })
    })
  }

  shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe()
  }

}
