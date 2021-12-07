import { QuestionType } from "../contribute/contribute.component";

export interface Question{
    _id?: any;
    question: string;
    category?: Category;
    status?: QuestionStatus;
    answers: Answers[];
    type?: QuestionType;
    correct_letter: string;
    correct_text: string;
    opened?: boolean;
    imageUrl?: any;
}

export type Category =  'GEOGRAFIJA' | 'ISTORIJA' | 'FILMOVI I SERIJE' | 'POZNATE LICNOSTI' | 'SPORT' | 'RAZNO';
  
export interface Answers{
    text: string;
    letter: string;
}

export interface DB{
  questions: Question[]
}

export type QuestionStatus = 'ODOBRENO' | 'NA CEKANJU' | 'ODBIJENO';