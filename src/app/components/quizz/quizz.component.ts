import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})

export class QuizzComponent implements OnInit {
  title: string = '';
  questions: any[] = [];
  questionSelected: any;

  answers: string[] = [];
  answerSelected: string = '';

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;
  loading: boolean = true;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loading = true;
    this.quizService.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        this.questionMaxIndex = this.questions.length;
        this.questionSelected = this.questions[this.questionIndex];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar perguntas:', err);
        alert('Não foi possível carregar as perguntas. Tente novamente mais tarde.');
        this.loading = false;
      }
    });
  }

  playerChoose(value: string) {
    if (!value) {
      alert('Por favor, selecione uma resposta.');
      return;
    }
    this.answers.push(value);
    this.nextStep();
  }

  restartQuiz() {
    this.finished = false;
    this.answers = [];
    this.questionIndex = 0;
    this.questionSelected = this.questions[this.questionIndex];
  }

  async nextStep() {
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected = finalAnswer === 'A' ? 'Você seria um vilão!' : 'Você seria um herói!';
    }
  }

  async checkResult(answers: string[]) {
    const result = answers.reduce((prev, curr, i, arr) => {
      if (
        arr.filter((item) => item === prev).length >
        arr.filter((item) => item === curr).length
      ) {
        return prev;
      } else {
        return curr;
      }
    });

    return result;
  }
}