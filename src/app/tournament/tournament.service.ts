import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TournamentService{

    get room(){ return this._room}
    set room(value: string){this._room = value}

    get setupReady(){ return this._setupReady}
    set setupReady(value: boolean){this._setupReady = value}

    
    private _setupReady = false;
    private _room = '';
}