import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalWrapper } from '../modal-service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {

  constructor(private modal: ModalWrapper) { }

  get attempts(){ return this._attempts }
  set attempts(value){this._attempts = value}

  ngOnInit(): void {
    this.modal.openPlayModal.emit(true);
  }

  ngOnDestroy(){
    this.modal.openPlayModal.emit(false);
  }

  public reduceOneAttempt(){
      this.reduceAttempts();
  }
  private reduceAttempts(){
    if(this._attempts.length > 0){
      this.attempts.pop();
    }
  }

  private _attempts = [1,1,1];

}
