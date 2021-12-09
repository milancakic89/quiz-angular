import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { ApiResponse, ApiService } from "./api.servise";

export interface User{
  id?: number;
  avatar_url?: string;
  name?: string;
  email: string;
  title: string;
  lives: number;
  playing: boolean;
  password: string;
  score: number;
  roles: string[];
  tickets: number;
  achievements: Achievement;
  categories: Category[];
  reset_password_token: string;
  increase_lives_at: number;
  reset_lives_at: number;
  notifications: Notifications;
 
}

interface Notifications{
  achievements: boolean;
  questions: boolean;
  ranking: boolean;
}

interface Achievement{
  category: string;
  answered: number;
  achievement_ticket_ids: string[]
}

interface Category{
  category: string,
  questions_added: string;
}


export interface UserResponse{
  success: boolean;
  message: string;
  data: User;
  token: string;
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
  return localStorage.getItem('access')
}




@Injectable({providedIn: 'root'})
export class Configuration{
    constructor(private router: Router, private service: ApiService){ }

    get user() { return this._user}
    set user(value){this._user.next(value as any as User)}

    get isRoot(){return isRoot()}
    set isRoot(value){setRoot(value)}

    get token(){return getToken()}
    set token(value: any){setToken(value)}

    get isGameRunning(){return isGameRunning()}
    set setGameRunning(value: boolean){setGameRunning(value)}

    get logged(){return logged()}
    set logged(value){ setLogged(value)}
    


  public createUser(email: string, password: string){
    return this.service.post<any>('/signup', { email, password }, 'Registracija neuspesna. Pokusajte ponovo');
    }

  public login(email: string, password: string){
      return this.service.post<User>('/login', {email, password}, 'Neuspelo logovanje. Pokusajte ponovo');
  }

  public saveUser(user: User, token: string){
      isLogged.root = user.roles.some((role: any) => role === 'ADMIN');
      isLogged.logged = true;
      setToken(token);
      this._user.next(user);
    }

    public async refreshUser(){
      return this.service.post<User>('/refresh', {}, '')
    }

    public async attemptAutoLogin(){
      const { data, success } = await this.service.post<User>('/autologin', {}, 'Automatsko logovanje nije uspelo')
      if (success) {
        this.isRoot = data.roles.some((role: any) => role === 'ADMIN');
        this.logged = true;
        this._user.next(data);
      }
    }

    public getToken(){
      return 
    }

    public logout(){
      this.logged = false;
      localStorage.removeItem('access');
      this._user.next(null)
      this.router.navigateByUrl('/')
    }

    private _user = new BehaviorSubject<User | any>(null);
}
