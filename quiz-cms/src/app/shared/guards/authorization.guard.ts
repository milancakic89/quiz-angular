import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Configuration } from '../config.service';

interface Access{
    email: string;
    password: string;
}

@Injectable({providedIn: 'root'})
export class AuthorizationGuard implements CanActivate {
    constructor(private router: Router, private config: Configuration) { }

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return true;
        return new Promise((resolve, reject)=>{
            if(this.config.logged){
                resolve(true)
                return;
            }
           resolve(false)
        })

    }

}
