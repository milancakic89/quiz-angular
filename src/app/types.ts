export interface User{
        notifications: {
            achievements: boolean,
            questions: boolean,
            ranking: boolean
        },
        _id: string;
        email: string;
        name: string;
        title: string;
        score: number;
        lives: number;
        tickets: number;
        playing: boolean,
        roles: string[],
        contributions: [],
        avatar_url: string;
        questions: any[],
        room: string;
        socket: string;
        friendRequests: [];
        friends: string[];
        online: boolean;
        account_activated: boolean;
        shop_items: string[];
        avatar_border: string;
}


export interface Room {
    created_by: string;
    roomName: string;
}