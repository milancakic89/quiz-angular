import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Configuration } from '../config.service';


export type AllowBack = true | false;

@Injectable({ providedIn: 'root' })
export class PlayGuard implements CanDeactivate<AllowBack> {
    constructor(private config: Configuration) { }

    public canDeactivate(
        allow: AllowBack,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return new Promise((resolve, reject) => {
            this.config.refreshUser().then(data =>{
                if(data && data.data){
                    const user = data.data;
                    if(user.playing){
                        return resolve(false);
                    }
                    return resolve(true);
                }
                return resolve(true);
            })
        })


    }

}
