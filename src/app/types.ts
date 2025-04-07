export interface User {
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

export interface Question {
    _id: string;
    answered_correctly: number;
    answered_wrong: number;
    answers: Answer[];
    category: string;
    correct_letter: string;
    correct_text: string;
    imageUrl: string;
    posted_by: string;
    question: string;
    question_difficulty: number;
    question_picked: number;
    status: 'ODOBRENO' | 'ODBIJENO' | 'NA CEKANJU'
    type: 'REGULAR' | 'PICTURE'
}

export interface Answer{
    text: string;
    letter: 'A' | 'B' | 'C' | 'D'
}