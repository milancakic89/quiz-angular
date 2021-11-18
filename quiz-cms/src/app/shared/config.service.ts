import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiService } from "./api.servise";

export interface User{
  id?: number;
  image_url?: string;
  name?: string;
  email: string;
  title: string;
  password: string;
  score: number;
  contributions: number;
  roles: string[];
}

export interface UserResponse{
  success: boolean;
  message: string;
  user: User;
}

export interface UserAutoLogin{
  email?: string;
  password?: string;
  roles?: string[];
}

export interface LoginResponse{
  success: boolean;
  message: string;
}

export interface SignupResponse { 
  success: boolean;
  message: string;
  data: any;
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

export const setToken = (value: string) => {
  localStorage.setItem('access', value)
}

export const getToken = () => {
  localStorage.getItem('access')
}


@Injectable({providedIn: 'root'})
export class Configuration{
    constructor(private router: Router, private service: ApiService){ }

    get user() { return this._user}
    set user(value){this._user.next(value)}

    get isRoot(){return isRoot()}
    set isRoot(value){setRoot(value)}

    get isGameRunning(){return isGameRunning()}
    set setGameRunning(value: boolean){setGameRunning(value)}

    get logged(){return logged()}
    set logged(value){ setLogged(value)}


  public createUser(email: string, password: string){
      return this.service.post('/signup', { email, password });
    }

    public login(email: string, password: string){
       return this.service.post('/login', {email, password});
    }

  public saveUser(user: User, token: string){
      isLogged.root = user.roles.some((role: any) => role === 'ADMIN');
      isLogged.logged = true;
      setToken(token);
      this._user.next(user);
    }

    public async attemptAutoLogin(){
      this.service.post('/autologin', {}).subscribe((data: UserResponse | any) =>{
        if(data && data.user){
          this.isRoot = data.user.roles.some((role: any) => role === 'ADMIN');
          this.logged = true;
          this._user.next(data.user);
        }
      });
    }

    public logout(){
      this.logged = false;
      localStorage.removeItem('access');
      this._user.next(null)
      this.router.navigateByUrl('/')
    }

    private _user = new BehaviorSubject<any>(null);
}
