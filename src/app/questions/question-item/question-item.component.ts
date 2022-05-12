import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }



  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      if(params['id']){
        this._id = params['id'];
        this.load();
      }
    })
  }


  public load(){
    console.log(this._id);
  }

  private _id = '';
}
