import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({providedIn: 'root'})
export class Configuration{
    constructor(){
        this.initDB();
    }

    get user() { return this._user}
    set user(value){this._user.next(value)}

    private initDB(){
        if(!localStorage.getItem('db')){
            setTimeout(()=>{
              const data = {
                user:{
                  email: 'test@test.com',
                  password: 'korleone',
                  roles: ['user']
                },
              }
              localStorage.setItem('db', JSON.stringify(data))
              this.user.next(data)
            },300)
          
          }else{
            setTimeout(()=>{
              const data = JSON.parse(JSON.stringify(localStorage.getItem('db'))) as any
              this.user.next(data)
            },300)
        }
    }

    private _user = new BehaviorSubject<any>(null);
}
