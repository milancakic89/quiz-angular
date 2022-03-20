import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { SocketService } from "../socket-service";
import { ApiResponse, ApiService } from "./api.servise";

export interface User{
  _id: string;
  avatar_url: string;
  name: string;
  email: string;
  title: string;
  lives: number;
  playing: boolean;
  password: string;
  lives_timer_ms: number;
  score: number;
  roles: string[];
  tickets: number;
  achievements: Achievement;
  categories: Category[];
  reset_password_token: string;
  increase_lives_at: number;
  reset_lives_at: number;
  daily_price: number;
  notifications: Notifications;
  friends: string[];
  friendRequests: string[];
  socket: boolean;
  online: boolean;
  selected?: boolean;
 
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
  gameRunning: false,
  roomCleaned: false
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
    constructor(private router: Router, private service: ApiService, private socketService: SocketService){ }

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

  public facebookLogin(id: number, name: string){
    return this.service.post<User>('/facebook-login', {name, id}, 'Neuspelo logovanje. Pokusajte ponovo ili napravite nalog');
  }

  public saveUser(user: User, token: string){
      isLogged.root = user.roles.some((role: any) => role === 'ADMIN');
      isLogged.logged = true;
      setToken(token);
      this.socketService.emit('SAVE_SOCKET', {user_id: user._id})
      this._user.next(user);
    }

    public async refreshUser(){
      return this.socketService.socket.emit('REFRESH_USER', {user_id: this._user.getValue()._id})
    }

    public attemptAutoLogin(){
      console.log('autologin atempt')
      this.socketService.socket.emit('AUTOLOGIN', {Authorization: this.token})
    }

    public getToken(){
      return 
    }

    public logout(){
      localStorage.clear()
      localStorage.removeItem('access');
      this.socketService.emit('DISCONNECT_USER', {});
      setTimeout(()=>{
        this.logged = false;
        this._user.next(null)
        this.router.navigateByUrl('/')
      },100)

    }

    private _user = new BehaviorSubject<User | any>(null);
}
