import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { NotificationService } from "./notification.service";


const getToken = () =>{
    return localStorage.getItem('access');
}

export interface ApiResponse<T>{
    success: boolean;
    message: string;
    token?:string;
    data: T;
}

@Injectable({providedIn: 'root'})
export class ApiService{
    constructor(private http: HttpClient, private nothService: NotificationService){}


    public async get<T>(url: string, errorMessageFeedback: string){
        const { data, success, error } = await this.mapToResponse<T>(this.http.get<any>(this.localApi + url, {
            headers: {
                Authorization: 'Bearer ' + getToken()
            }
        }).toPromise() as any, errorMessageFeedback)
        return { data, success, error };
    }

    public async post<T>(url: string, body: any, errorMessageFeedback: string) {
        let config: any = {}
        Object.keys(body).forEach(key =>{
            config[`${key}`] = body[`${key}`]
        })
        const { data, success, error} = await this.mapToResponse<T>(this.http.post(this.localApi + url, config, {
            headers: {
                Authorization: 'Bearer ' + getToken(),
            }
        }).toPromise() as any, errorMessageFeedback)
        return { data, success, error};
    }

    public async delete<T>(url: string, body: any, errorMessageFeedback: string) {
        let config: any = { }
        Object.keys(body).forEach(key => {
            config[`${key}`] = body[`${key}`]
        })
        const { data, success, error } = await this.mapToResponse<T>(this.http.delete(this.localApi + url, {
            headers: {
                Authorization: 'Bearer ' + getToken(),
            }
        }).toPromise() as any, errorMessageFeedback);
        return { data, success, error};
    }

    public mapToResponse<T>(promise: Promise<ApiResponse<T>>, errorMessageFeedback: string): Promise<{data: T, success: boolean, error: string}>{
        return promise.then( (data: any) =>{
            if(data.success){
                return {
                    data: data.data as any as T,
                    success: data.success,
                    error: data.error
                }
            }
            return {
                data: undefined as any,
                success: false,
                error: errorMessageFeedback
            }
           
        })
        .catch((error: any) =>{
            this.nothService.notification.emit({message: 'Error conecting to server: ' + error, success: false});
            return {
                data: undefined as any,
                success: false,
                error: errorMessageFeedback
            }
            })
    }

    private localApi = 'http://localhost:3000';
}