import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";


const getToken = () =>{
    return localStorage.getItem('access');
}

export interface Response<T>{
    success: boolean;
    message: string;
    data: any;
}

@Injectable({providedIn: 'root'})
export class ApiService{
    constructor(private http: HttpClient){}


    public get(url: string){
        return this.http.get<any>(this.localApi + url,{
            headers:{
                Authorization: 'Bearer ' + getToken()
            }
        })
    }

    public post(url: string, body: any) {
        let config: any = {}
        Object.keys(body).forEach(key =>{
            config[`${key}`] = body[`${key}`]
        })
        return this.http.post(this.localApi + url, config, {headers:{
                Authorization: 'Bearer ' + getToken(),
        }})
    }

    public delete(url: string, body: any) {
        let config: any = { }
        Object.keys(body).forEach(key => {
            config[`${key}`] = body[`${key}`]
        })
        return this.http.delete(this.localApi + url, {
            headers: {
                Authorization: 'Bearer ' + getToken(),
            }
        })
    }

    private localApi = 'http://localhost:3000';
}