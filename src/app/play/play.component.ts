import { NonNullAssert } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalWrapper } from '../modal-service';
import { QuestionService } from '../questions/questions.service';
import { Answers, Question } from '../questions/types';
import { Configuration } from '../shared/config.service';
import { NotificationService } from '../shared/notification.service';
import { SocketService } from '../socket-service';
import { PlayService } from './play.service';

interface Letter{
  label: string | null;
  in_use: boolean;
  id: string;
}
@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnDestroy, OnInit {

  constructor(private modal: ModalWrapper,
    private router: Router,
    private config: Configuration,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private playService: PlayService,
    private socketService: SocketService,
    private questionService: QuestionService) { }

  get attempts() { return this._attempts }
  set attempts(value) { this._attempts = value }

  get userContributions() { return this.config.user.getValue().categories as unknown as any }

  public time = 150;
  public score = 0;

  public questionCount = 0;
  public question: Question = {
    question: '',
    status: 'NA CEKANJU',
    answers: [],
    correct_letter: '',
    type: 'REGULAR',
    correct_text: '',
    opened: false
  };
  public timeInterval: any = null;
  public questionSelected = false;
  public selectedLetter = '';
  public playCategory = '';
  public showModal = true;
  public lives = 0;
  public nextQuestionInterval = 1000;
  public progressBarPercentage = 0;
  public correct = 0;
  public showCorrect = false;
  public btnIndex: any = null;
  public disable = false;
  public subscription: Subscription = null as unknown as Subscription;
  public wordAnswer: any = [];

  public topLetters: Letter[] = []; //[]
  public bottomLetterBoxes: Letter[][] = [];//[[]]

  ngOnInit() {
    this.config.user.subscribe(user => {
      if (user) {
        this.lives = user.lives;
      }
    })

    this.route.params.subscribe(params =>{
      if(params['category']){
        this.playCategory = params['category'];
        this.showModal = false;
        this.initGame();
      }
    })

    this.subscription = this.socketService.socketData.subscribe(data =>{
      if (data && data.event === 'GET_QUESTION'){
        this.disable = false;
        this.correct = 0;
        this.showCorrect = false;
        this.btnIndex = null;
        this.question = data.data;
        this.questionCount++;
        this.selectedLetter = '';
        this.questionSelected = false;
        this.time = 2000;
        this.initTime();
        const leters = []
        if(this.question.type === 'WORD'){
          this.question.answers.forEach((arr: string[], i: number) =>{
            this.bottomLetterBoxes.push([])
          })
          setTimeout(() =>{
            this.question.answers.forEach((arr: string[], i: number) => {
              arr.forEach((letter, j) => {
                let id = this.generateId();
                this.bottomLetterBoxes[i].push( {label: null, in_use: false, id} );
                this.topLetters.push({ label: letter, in_use: false, id })
              })
            })
          },10)

          setTimeout(() => {
            console.log({
              top: this.topLetters,
              bottom: this.bottomLetterBoxes
            })
          }, 1000)
        }
      }

      if (data && data.event === 'CHECK_PRACTICE_QUESTION') {
        if (data.data) {
          this.score++;
          this.updateProgressBar();
          this.correct = 2
            setTimeout(() => {
              if (this.attempts.length) {
                this.getQuestion();
              } else {
                this.gameOver('You have missed 3 times');
              }

            }, this.nextQuestionInterval)
        } else {
          this.correct = 1;
          this.reduceAttempts();
          setTimeout(() => {
            if (this.attempts.length) {
              this.getQuestion();
            } else {
              this.gameOver('You have missed 3 times');
            }

          }, this.nextQuestionInterval)
        } 
      }
    })
  }

  public generateId(){
    return '_' + Math.random().toString(36).substring(2, 9);
  }

  public addLetter(topLetter: Letter){
      let founded = false;
      this.bottomLetterBoxes.forEach((bottomLetterBox) =>{
        bottomLetterBox.forEach(bottomLetter =>{
          if(founded){return}
          if (!bottomLetter.in_use){
              founded = true;
              bottomLetter.in_use = true;
              topLetter.in_use = true;
              bottomLetter.label = topLetter.label;
            }
          })
      })

      setTimeout(() => {
        console.log(this.bottomLetterBoxes)
      }, 200 )
  }

  public removeLetter(bottomLetter: Letter){
    const letter = this.topLetters.find(item => item.id === bottomLetter.id);
    if(letter){
      bottomLetter.in_use = false;
      bottomLetter.label = null;
      letter.in_use = false;
    }
    
    // this.topLetters.forEach(letter =>{
    //   if(letter.id === applyLetter.id){
    //     letter.in_use = false;
    //     applyLetter.in_use = false;
    //     applyLetter.label = null
    //   }
    // })
  }

  public isCategoryAllowed(category: String) {
    return true;
    if (category === 'GEOGRAFIJA' || this.config.isRoot) {
      return true;
    }
    const userContribution = this.userContributions.find((c: any) => c.category === category);
    if (userContribution) {
      return userContribution.questions_added >= 5;
    }
    return false;
  }

  public questionsLeftToOpen(category: String): number{
    const userContribution = this.userContributions.find((c: any) => c.category === category);
    if (userContribution) {
      const toAdd = 5 - userContribution.questions_added;
      if(toAdd > 0){
        return toAdd;
      }
      return 0;

    }
    return 5;
  }

  ngOnDestroy() {
    this.modal.startGame.next(false);
    this.playService.allowBackButton = true;
    this.subscription.unsubscribe();
    clearInterval(this.timeInterval);
  }

  public initGame() {
    this.modal.startGame.next(true)
    this.playService.allowBackButton = false;
    this.score = 0;
    this.time = 2000;
    this.progressBarPercentage = 0;
    this.questionCount = 0;
    this.getQuestion();
  }

  public async getQuestion() {

    if (this.questionCount >= 15 || !this.attempts.length) {
      return this.gameOver('End of game');
    }
    if (this.disable) {
      return;
    }
    this.disable = true;
    this.bottomLetterBoxes = [];
    this.wordAnswer = [];
    this.topLetters = [];
    this.socketService.emit('GET_QUESTION', { category: this.playCategory })
  }

  public initTime() {
    clearInterval(this.timeInterval)
    this.timeInterval = setInterval(() => {
      if (this.time > 0) {
        this.time--;
      } else {
        this.timeWarning();
      }
    }, 1000)
  }

  public async timeWarning() {
    this.questionSelected = true;
    this.stopTime();
    setTimeout(() => {
      if (this.attempts.length) {
        this.getQuestion();
      } else {
       return this.gameOver('You have missed 3 times');
      }

    }, this.nextQuestionInterval)
  }

  public updateProgressBar() {
    switch (this.score) {
      case 0:
        this.progressBarPercentage = 2;
        break;
      case 1:
        this.progressBarPercentage = 3;
        break;
      case 2:
        this.progressBarPercentage = 4;
        break;
      case 3:
        this.progressBarPercentage = 5;
        break;
      case 4:
        this.progressBarPercentage = 17;
        break;
      case 5:
        this.progressBarPercentage = 21;
        break;
      case 6:
        this.progressBarPercentage = 27;
        break;
      case 7:
        this.progressBarPercentage = 34;
        break;
      case 8:
        this.progressBarPercentage = 41;
        break;
      case 9:
        this.progressBarPercentage = 48;
        break;
      case 10:
        this.progressBarPercentage = 53;
        break;
      case 11:
        this.progressBarPercentage = 61;
        break;
      case 12:
        this.progressBarPercentage = 70;
        break;
      case 13:
        this.progressBarPercentage = 80;
        break;
      case 14:
        this.progressBarPercentage = 90;
        break;
      case 15:
        this.progressBarPercentage = 100;
        break;
    }
  }

  public gameOver(message?: string) {
    this.stopTime();
    let points = 0;
    this.playService.allowBackButton = true;
    if (this.score > 4 && this.score <= 7) {
      points = 1;
    }
    if (this.score > 7 && this.score <= 10) {
      points = 2
    }
    if (this.score > 10 && this.score <= 12) {
      points = 3;
    }
    if (this.score > 12 && this.score <= 14) {
      points = 4;
    }
    if (this.score > 14) {
      points = 5;
    }
    if (this.score <= 4 ) {
      this.reduceOneLife();
    }
    this.modal.gameResults.next({
      success: points !== 0,
      results: points,
      showModal: true
    });
    this.score = 0;
    this.attempts = [1, 1, 1]
    this.modal.startGame.next(false)
    this.router.navigateByUrl('/play')
  }

  public closeModal(category: string, allowedCategory: string) {
    const allowed = this.isCategoryAllowed(allowedCategory);
    if (!allowed) {
      return;
    }
    this.playCategory = category;
    this.router.navigateByUrl(`/play/${category}`);

    setTimeout(() => {
      this.showModal = false;
    }, 1600)

  }

  public async onSelectedAnswer(answer: Answers, questionId: number, btnIndex: number) {
    if (this.questionSelected) {
      return;
    }
    this.questionSelected = true;
    this.selectedLetter = answer.letter;
    this.stopTime();
    this.btnIndex = btnIndex;
    this.updateQuestion()
  }

  public async updateQuestion() {
    this.socketService.emit('CHECK_PRACTICE_QUESTION', { question_id: this.question._id, correct: this.selectedLetter})
  }

  public backToProfile(){
    this.playService.allowBackButton = true;
    this.router.navigateByUrl('/profile')
  }

  public stopTime() {
    clearInterval(this.timeInterval);
  }

  public async reduceOneLife() {
    this.playService.reduceOneLife()
  }

  private reduceAttempts() {
    if (this._attempts.length > 0) {
      this.attempts.pop();
    }

  }

  private _attempts = [1, 1, 1];
  private _userId: string = '';

}
