import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsComponent } from './questions.component';
import { QuestionsRoutingModule } from './questions-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuestionItemComponent } from './question-item/question-item.component';



@NgModule({
  declarations: [
    QuestionsComponent,
    QuestionItemComponent
  ],
  imports: [
    CommonModule,
    QuestionsRoutingModule,
    FormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class QuestionsModule { }
