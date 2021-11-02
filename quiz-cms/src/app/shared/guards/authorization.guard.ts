import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({providedIn: 'root'})
export class AuthorizationGuard implements CanActivate {
    constructor(private router: Router) { }

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
            if(localStorage.getItem('unauthorized')){
                console.log('blocked')
                return true;
            }
        return true;
    }

}
