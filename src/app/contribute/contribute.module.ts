import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributeComponent } from './contribute.component';
import { ContributeRoutingModule } from './contribute-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AddQuestionStepperComponent } from './add-question-stepper/add-question-stepper.component';
import { AddImageQuestionComponent } from './add-image-question/add-image-question.component';
import { AddWordQuestionComponent } from './add-word-question/add-word-question.component';



@NgModule({
  declarations: [
    ContributeComponent,
    AddQuestionStepperComponent,
    AddImageQuestionComponent,
    AddWordQuestionComponent
  ],
  imports: [
    CommonModule,
    ContributeRoutingModule,
    NgSelectModule,
    FormsModule,
    SharedModule
  ]
})
export class ContributeModule { }
