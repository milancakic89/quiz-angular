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

export type Category =  'Geografija' | 'Istorija' | 'Filmovi i Serije' | 'Poznate licnosti' | 'Sport';
  
export interface Answers{
    text: string;
    letter: string;
}

export interface DB{
  questions: Question[]
}

export type QuestionStatus = 'ODOBRENO' | 'NA CEKANJU' | 'ODBIJENO';