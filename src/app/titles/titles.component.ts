import { Component, OnInit } from '@angular/core';

interface Title{
  id?: any;
  label: string;
  starts_from_value: number;
  ends_at_value: number;
}

@Component({
  selector: 'app-titles',
  templateUrl: './titles.component.html',
  styleUrls: ['./titles.component.scss']
})
export class TitlesComponent implements OnInit {

  constructor() { }

  get title(){return this._title}
  set title(value){this._title = value}

  public titles: Title[] = []

  ngOnInit(): void {
    if(localStorage.getItem('titles')){
      this.titles = JSON.parse(localStorage.getItem('titles') || '') as Title[];
      return;
    }
    const titlesDB: Title[] = [
      {id: 1, label: 'Pocetnik', starts_from_value: 0, ends_at_value: 50},
      {id: 2, label: 'Pocetnik |', starts_from_value: 51, ends_at_value: 100},
      {id: 3, label: 'Pocetnik ||', starts_from_value: 101, ends_at_value: 150},
      {id: 4, label: 'Kvizoman', starts_from_value: 151, ends_at_value: 200},
      {id: 5, label: 'Kvizoman |', starts_from_value: 201, ends_at_value: 250},
      {id: 6, label: 'Kvizoman ||', starts_from_value: 251, ends_at_value: 300},
    ];

    this.titles = titlesDB;
    localStorage.setItem('titles', JSON.stringify(titlesDB));
  }

  public onFormSubmit(){
    let id = Date.now();
    this.titles.push({
      id: id,
      label: this._title.label,
      starts_from_value: this._title.starts_from_value,
      ends_at_value: this._title.ends_at_value
    });

    localStorage.setItem('titles', JSON.stringify(this.titles));
  }

  public deleteTitle(id: number){
    this.titles = this.titles.filter(title => title.id !== id);
    localStorage.setItem('titles', JSON.stringify(this.titles));
  }

  private _title: Title = {
    label: '',
    starts_from_value: 0,
    ends_at_value: 0
  }

}
