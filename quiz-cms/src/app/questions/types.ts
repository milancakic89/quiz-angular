export interface Question{
    answeredCorrect: number;
    answeredWrong: number;
    question_text: string;
    status: QuestionStatus;
    answers: Answers[];
    correct_letter: string;
    correct_text: string;
    opened?: boolean;
}
  
export interface Answers{
    answer_text: string;
    answer_letter: string;
}

export interface DB{
  questions: Question[]
}

export type QuestionStatus = 'PRIHVACENO' | 'NA CEKANJU' | 'ODBIJENO';