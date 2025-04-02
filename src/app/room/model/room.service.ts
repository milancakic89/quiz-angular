import { Injectable } from "@angular/core";
import { BehaviorSubject, filter } from "rxjs";

interface RoomOwner {
    room: string;
    owner_id: string;
}

@Injectable({ providedIn: 'root'})
export class RoomService {
    private _roomId$ = new BehaviorSubject<string>('');
    private _userPlaying$ = new BehaviorSubject<boolean>(false);
    private _roomAndOwner$ = new BehaviorSubject<RoomOwner | null>(null);
    private _hideNavbar$ = new BehaviorSubject(false);

    roomId$ = this._roomId$.asObservable();
    userPlaying$ = this._userPlaying$.asObservable();

    roomAndOwner$ = this._roomAndOwner$.asObservable().pipe(filter(Boolean));

    hideNavbar$ = this._hideNavbar$.asObservable();


    setRoomId(id: string){
        this._roomId$.next(id);
    }

    setUserPlaying(playing: boolean){
        this._userPlaying$.next(playing);
    }

    setRoomAndOwner(roomAndOwnerId: RoomOwner){
        this._roomAndOwner$.next(roomAndOwnerId);
    }

    setHideNavbar(val: boolean){
        this._hideNavbar$.next(val);
    }
}