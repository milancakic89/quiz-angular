import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'add-question-stepper',
  templateUrl: './add-question-stepper.component.html',
  styleUrls: ['./add-question-stepper.component.scss']
})
export class AddQuestionStepperComponent implements OnInit {

  constructor() { }

  public step = 1;
  @Input() public categories: {title: string, value: any}[] = [];

  @Output() canceled = new EventEmitter();

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

}
