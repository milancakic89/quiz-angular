import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule
  ]
})
export class SettingsModule { }
