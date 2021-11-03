import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Configuration } from '../config.service';


@Injectable({providedIn: 'root'})
export class AuthorizationGuard implements CanActivate {
    constructor(private router: Router, private config: Configuration) { }

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        return new Promise((resolve, reject)=>{
            this.config.user.subscribe(user =>{
                if(user){
                    resolve(true);
                }
            })
        })

    }

}
