import { QuestionType } from "../contribute/contribute.component";

export interface Question{
    _id?: any;
    question: string;
    category?: Category;
    status?: QuestionStatus;
    answers: any;
    type?: QuestionType;
    correct_letter?: string;
    correct_text: string;
    opened?: boolean;
    imageUrl?: any;
    posted_by?: string;
    firebasePath?: string;
    question_picked?: string;
    answered_wrong?: number;
    answered_correctly?: number;
    deny_reason?: string;
}

export type Letters = string[];

export type Category =  'GEOGRAFIJA' | 'ISTORIJA' | 'FILMOVI I SERIJE' | 'MUZIKA' | 'POZNATE LICNOSTI' | 'SPORT' | 'RAZNO';
  
export interface Answers{
    text: string;
    letter: string;
}

export interface DB{
  questions: Question[]
}

export type QuestionStatus = '' | 'ODOBRENO' | 'NA CEKANJU' | 'ODBIJENO';