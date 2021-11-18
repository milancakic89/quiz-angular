export interface Question{
    _id?: any;
    question: string;
    status?: QuestionStatus;
    answers: Answers[];
    correct_letter: string;
    correct_text: string;
    opened?: boolean;
}
  
export interface Answers{
    text: string;
    letter: string;
}

export interface DB{
  questions: Question[]
}

export type QuestionStatus = 'PRIHVACENO' | 'NA CEKANJU' | 'ODBIJENO';