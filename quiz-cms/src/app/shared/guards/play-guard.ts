import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

const isPlayMode = (): boolean =>{
    if(sessionStorage.getItem('play-mode')){
        return JSON.parse(sessionStorage.getItem('play-mode') || '');
    }else{
        return false;
    }
    
}

export type AllowBack = true | false;

@Injectable({ providedIn: 'root' })
export class PlayGuard implements CanDeactivate<AllowBack> {
    constructor() { }

    public canDeactivate(
        allow: AllowBack,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
       return new Promise((resolve, reject) =>{
           let playMode = isPlayMode();
           if (playMode){
                return resolve(false)
           }else{
               resolve(true)
           }
       })
       

    }

}
