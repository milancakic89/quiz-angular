import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Settings{
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  imageUrl: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  constructor(private router: Router) { }

  get settings(){ return this._settings}
  set settings(value: Settings){ this._settings = value}


  ngOnInit(): void {
  }

  public backToProfile() {
    this.router.navigateByUrl('/profile')
  }

  public onFormSubmit(){
  }

  private _settings: Settings = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    imageUrl: '',
  }
}
