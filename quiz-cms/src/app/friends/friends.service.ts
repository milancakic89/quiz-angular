import { Injectable } from "@angular/core";
import { ApiService } from "../shared/api.servise";
import { Configuration, User } from "../shared/config.service";
import { SocketService } from "../socket-service";

@Injectable({providedIn: 'root'})
export class FriendsService{
    constructor(private service: ApiService,
                private config: Configuration,
                private socketService: SocketService){}

    public searchUsers(query: string){
        this.socketService.socket.emit('GET_ALL_USERS', {Authorization: this.config.token, query: query})
    }

    public getFriendsRequests(){
        this.socketService.socket.emit('GET_FRIEND_REQUESTS', {Authorization: this.config.token})
    }

    public getFriendsList(){
        this.socketService.socket.emit('GET_FRIEND_LIST', {Authorization: this.config.token})
    }

    public removeFriend(id: string){
        return this.service.post<User[]>('/remove-friend', {remove_id: id} ,'')
    }

}