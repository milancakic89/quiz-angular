import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { EVENTS } from '../events';
import { debounceTime, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { QuestionItemComponent } from '../shared/components/question-item/question-item.component';
import { Question } from '../types';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { OverlayLoaderComponent } from '../shared/components/overlay-loader/overlay-loader.component';

@Component({
  selector: 'app-my-questions',
  imports: [CommonModule, QuestionItemComponent, OverlayLoaderComponent],
  standalone: true,
  templateUrl: './my-questions.component.html',
  styleUrl: './my-questions.component.scss',
})
export class MyQuestionsComponent implements OnInit, OnDestroy{
  private _updating$ = new BehaviorSubject(false);
  private _refresh$ = new BehaviorSubject([]);
  private _cdr = inject(ChangeDetectorRef)
  socketService = inject(SocketService);


  questionMessage$ = this.socketService.messages$.pipe(
    filter(socketData => socketData.event === EVENTS.GET_QUESTIONS),
    map(socketData => socketData.data as Question[]),
  );

  questions$ = this._refresh$.pipe(
    switchMap(_ => {
      return this.questionMessage$
    })
  )

  refresh$ = this._refresh$.asObservable()

  questionSub: Subscription;

  updating$ = this._updating$.asObservable()

  isAdmin$ = this.socketService.isAdmin$;


  trackIndex(index: number){
    return index;
  }

  ngOnInit(): void {
    this.socketService.sendMessage({
      event: EVENTS.GET_QUESTIONS,
    })

    this.questionSub = this.questionMessage$.pipe(debounceTime(0)).subscribe(questions=> {
      this._updating$.next(false);
      this._cdr.detectChanges();
    })
  }

  ngOnDestroy(): void {
    this.questionSub.unsubscribe();
  }

  onUpdateQuestions(){
    this._updating$.next(true);
    this._refresh$.next([])
    this.socketService.sendMessage({
      event: EVENTS.GET_QUESTIONS
    })

  }
}
