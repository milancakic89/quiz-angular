import { NonNullAssert } from '@angular/compiler';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalWrapper } from '../modal-service';
import { QuestionService } from '../questions/questions.service';
import { Answers, Question } from '../questions/types';
import { Configuration } from '../shared/config.service';
import { NotificationService } from '../shared/notification.service';
import { PlayService } from './play.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnDestroy, OnChanges, OnInit {

  constructor(private modal: ModalWrapper,
    private router: Router,
    private config: Configuration,
    private notificationService: NotificationService,
    private playService: PlayService,
    private questionService: QuestionService) { }

  get attempts() { return this._attempts }
  set attempts(value) { this._attempts = value }

  get userContributions() { return this.config.user.getValue().categories as unknown as any }

  public time = 15;
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

  ngOnInit() {
    this.config.user.subscribe(user => {
      if (user) {
        this.lives = user.lives;
      }
    })
  }

  ngOnChanges(): void {
    this.modal.startGame.subscribe(bool => {
      if (bool) {
        this.initGame();
      }
    })

  }

  public isCategoryAllowed(category: String) {
    if (category === 'GEOGRAFIJA' || this.config.isRoot) {
      return true;
    }
    const userContribution = this.userContributions.find((c: any) => c.category === category);
    if (userContribution) {
      return userContribution.questions_added >= 10;
    }
    return false;
  }

  ngOnDestroy() {
    this.modal.startGame.next(false);
    this.playService.allowBackButton = true;
    clearInterval(this.timeInterval);
  }

  public initGame() {
    this.modal.startGame.next(true)
    this.playService.allowBackButton = false;
    this.score = 0;
    this.time = 15;
    this.progressBarPercentage = 0;
    this.questionCount = 0;
    this.getQuestion();
  }

  public async getQuestion() {
    if (this.questionCount >= 15 || !this.attempts.length) {
      return this.gameOver('End of game');
    }
    const { data, success } = await this.questionService.getSingleQuestion(this.playCategory)
    if (success) {
      this.correct = 0;
      this.showCorrect = false;
      this.btnIndex = null;
      this.question = data;
      this.questionCount++;
      this.selectedLetter = '';
      this.questionSelected = false;
      this.time = 15;
      this.initTime();
    } else {
      clearInterval(this.timeInterval);
      this.notificationService.notification.emit({
        success: false,
        message: 'Neuspelo izvlacenje pitanja iz baze, pokusajte ponovo'
      })
      this.router.navigateByUrl('/profile')
    }
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
    await this.updateQuestion(this.question.answers[0].text);
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
        this.progressBarPercentage = 6;
        break;
      case 1:
        this.progressBarPercentage = 6;
        break;
      case 2:
        this.progressBarPercentage = 10;
        break;
      case 3:
        this.progressBarPercentage = 14;
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
    if (this.score < 2) {
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

  }

  public closeModal(category: string, allowedCategory: string) {
    const allowed = this.isCategoryAllowed(allowedCategory);
    if (!allowed) {
      return;
    }
    this.playCategory = category;

    setTimeout(() => {
      this.showModal = false;
      this.initGame();
    }, 1600)

  }

  public async onSelectedAnswer(answer: Answers, questionId: number, btnIndex: number) {
    if (this.questionSelected) {
      return;
    }
    this.questionSelected = true;
    this.selectedLetter = answer.letter;
    this.stopTime();
    const correct = await this.updateQuestion(answer.text);
    this.btnIndex = btnIndex;
    if(correct){
      this.correct = 2;
    }else{
      this.correct = 1;
    }
    setTimeout(() => {
      if (this.attempts.length) {
        this.getQuestion();
      } else {
        this.gameOver('You have missed 3 times');
      }

    }, this.nextQuestionInterval)
  }

  public async updateQuestion(correct: string) {
    const { data, success } = await this.playService.checkQuestion(this.question._id, correct)
    if (success) {
      if (data) {
        this.score++;
        this.updateProgressBar();
        return true;
      } else {
        this.reduceAttempts();
        return false;
      }      
    } else {
      clearInterval(this.timeInterval)
      this.playService.allowBackButton = true;
      this.notificationService.notification.emit({
        success: false,
        message: 'Neuspelo izvlacenje pitanja iz baze, pokusajte ponovo'
      });
      //todo set user not playing in DB and then router him
      // this.router.navigateByUrl('/profile');
      return false;
    }
  }

  public backToProfile(){
    this.playService.allowBackButton = true;
    this.router.navigateByUrl('/profile')
  }

  public stopTime() {
    clearInterval(this.timeInterval);
  }

  public async reduceOneLife() {
    const { data, success } = await this.playService.reduceOneLife()
    if (success) {
      // this.config.user.next(data)
    }
  }

  private reduceAttempts() {
    if (this._attempts.length > 0) {
      this.attempts.pop();
    }

  }

  private _attempts = [1, 1, 1];
  private _userId: string = '';

}
