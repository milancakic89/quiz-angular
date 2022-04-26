import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributeComponent } from './contribute.component';
import { ContributeRoutingModule } from './contribute-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ContributeComponent
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
