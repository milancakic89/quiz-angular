import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TournamentService{

    get room(){ return this._room}
    set room(value: string){this._room = value}

    private _room = '';
}