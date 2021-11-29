
// import { Injectable } from "@angular/core";
// import { QuestionService } from "./questions.service";
// import { Answers } from "./types";

// interface Question{
//     question: string;
//     answers: Answers[];
//     correct_letter: string;
//     correct_text: string;
// }

// let textQuestions: any[];


// @Injectable({providedIn: 'root'})
// export class initialQuestionsSetup {
//     constructor(private service: QuestionService) { }

//     public questions: any;

//     public counter = 0;

   
//     public init = async () => {
//         if (this.counter >= this.questions.length) {
//             return;
//         }
//         this.setQuestions().then(bool =>{
//             this.counter++;
//             this.init()
//         })
//     }

//     private async setQuestions() {
//         return new Promise(async (resolve, reject) => {
//             const item = this.questions[this.counter];
//             if(item){
//                 const { data, success } = await this.service.addQuestion(this.questions[this.counter]);
//                 if( success ){
//                     if (data.success) {
//                         resolve(true);
//                     } else {
//                         resolve(false)
//                     }
//                 }
//             }else{
//                 this.init()
//             }
          
//         })
//     }

//     public cities(){
//        this.questions = JSON.parse(localStorage.getItem('questions') || '');
//        console.log(this.questions)
//     }
// }
