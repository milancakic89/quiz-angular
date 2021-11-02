import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  constructor() { }

  get email(){ return this._resetDetails.email}
  set email(value){ this._resetDetails.email = value}

  public title = 'Kviz opsteg znanja';

  ngOnInit(): void {
  }


  public onSubmit(){}

  private _resetDetails = {
    email: ''
  }
}
