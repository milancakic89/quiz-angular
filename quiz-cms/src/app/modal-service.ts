import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface GameData{
        success: boolean;
        showModal: boolean;
        results: any;
}

@Injectable({providedIn: 'root'})
export class ModalWrapper {
        public gameResults = new Subject<GameData>();
        public startGame = new Subject<boolean>();
}