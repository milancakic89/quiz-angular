import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

export interface User{
  id?: number;
  image_url?: string;
  name?: string;
  email: string;
  password: string;
  score: number;
  contributions: number;
  roles: string[];
}

export interface UserAutoLogin{
  email?: string;
  password?: string;
  roles?: string[];
}


const isLogged = {
  logged: false,
  root: false,
  gameRunning: false
}

export const logged = () =>{
  return isLogged.logged;
}

export const isRoot = () =>{
  return isLogged.root;
}

export const setGameRunning = (value: boolean) =>{
  isLogged.gameRunning = value;
}

export const isGameRunning = () =>{
  return isLogged.gameRunning;
}

export const setRoot = (value: boolean) =>{
  isLogged.root = value;
}

export const setLogged = (value: boolean) =>{
  isLogged.logged = value;
}


@Injectable({providedIn: 'root'})
export class Configuration{
    constructor(private router: Router){
        this.initDB();
    }

    get user() { return this._user}
    set user(value){this._user.next(value)}

    get isRoot(){return isRoot()}
    set isRoot(value){setRoot(value)}

    get isGameRunning(){return isGameRunning()}
    set setGameRunning(value: boolean){setGameRunning(value)}

    get logged(){return logged()}
    set logged(value){ setLogged(value)}

    private initDB(){
        if(!localStorage.getItem('db')){
              const data: User[] = [
                {
                  id: Date.now(),
                  name: 'Admin',
                  email: 'test@test.com',
                  password: 'korleone',
                  score: 0,
                  contributions: 0,
                  roles: ['admin']
                },
                {
                  id: Date.now() + 10,
                  email: 'test1@test.com',
                  password: 'korleone',
                  score: 0,
                  contributions: 0,
                  roles: ['user']
                }
              ]
              localStorage.setItem('db', JSON.stringify(data))
          }
    }

    public async getUser(email: string, password: string): Promise<User | null>{
      return new Promise((resolve, reject)=>{
        const db = JSON.parse(localStorage.getItem('db') || '') as User[];
        if(db){
          const user = db.find(user => user.email === email && user.password === password);
          if(user){
            this.isRoot = user.roles.some( role => role === 'admin');
            const credentials = {email: user.email, password: user.password}
            localStorage.setItem('access', JSON.stringify(credentials));
            this.logged = true;
            this._user.next(user);
            resolve(user);
            return;
          }
          this._logged = false;
          this._user.next(null);
          resolve(null);
        }
      })
    }

    public createUser(email: string, password: string){
      const db = JSON.parse(localStorage.getItem('db') || '') as User[];
      const newUser: User = {
        id: Date.now(),
        email,
        password,
        score: 0,
        contributions: 0,
        roles: ['user']
      }

      db.push(newUser)
      localStorage.setItem('db', JSON.stringify(db))
    }

    public async attemptAutoLogin(){
      if(localStorage.getItem('access')){
        const savedUser = JSON.parse(localStorage.getItem('access') || '') as UserAutoLogin;
        if(savedUser && savedUser.email && savedUser.password){
          await this.getUser(savedUser.email, savedUser.password)
        }
      }
    }

    public logout(){
      this.logged = false;
      localStorage.removeItem('access');
      this._user.next(null)
      this.router.navigateByUrl('/')
    }

    private _user = new BehaviorSubject<any>(null);
    private _root= false;
    private _logged = false;
}
