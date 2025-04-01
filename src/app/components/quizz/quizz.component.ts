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

  timeLeft: number = 10;
  interval: any;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loading = true;

    this.quizService.getQuestions().subscribe({
      next: (data) => {
        this.questions = this.shuffleArray(data); 
        this.questionMaxIndex = this.questions.length;

        const savedProgress = localStorage.getItem('quizProgress');
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          this.questionIndex = progress.questionIndex;
          this.answers = progress.answers;
          this.finished = progress.finished;

          if (this.finished) {
            const finalAnswer: string = this.checkResult(this.answers);
            this.answerSelected = this.getResultMessage(finalAnswer);
          } else {
            this.questionSelected = this.questions[this.questionIndex];
            this.startTimer();
          }
        } else {
          this.questionSelected = this.questions[this.questionIndex];
          this.startTimer();
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar perguntas:', err);
        alert('Não foi possível carregar as perguntas. Tente novamente mais tarde.');
        this.loading = false;
      }
    });
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  startTimer(): void {
    this.timeLeft = 10; 
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.nextStep(); 
      }
    }, 1000); 
  }

  stopTimer(): void {
    clearInterval(this.interval);
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
    localStorage.removeItem('quizProgress');
    this.finished = false;
    this.answers = [];
    this.questionIndex = 0;
    this.questions = this.shuffleArray(this.questions);
    this.questionSelected = this.questions[this.questionIndex];
    this.startTimer();
  }

  shareResult(): void {
    const shareText = `Meu resultado no quiz foi: ${this.answerSelected}`;
    const shareUrl = encodeURIComponent(window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    window.open(twitterUrl, '_blank');
  }

  async nextStep() {
    this.stopTimer();
    this.questionIndex += 1;

    localStorage.setItem('quizProgress', JSON.stringify({
      questionIndex: this.questionIndex,
      answers: this.answers,
      finished: this.finished
    }));

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
      this.startTimer();
    } else {
      const finalAnswer: string = this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected = this.getResultMessage(finalAnswer);
    }
  }

  checkResult(answers: string[]): string {
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

  getResultMessage(resultAlias: string): string {
    const resultsMap: { [key: string]: string } = {
      A: 'Você seria um super vilão!',
      B: 'Você seria um super herói!',
      C: 'Você seria um anti-herói!',
      D: 'Você seria neutro!'
    };

    return resultsMap[resultAlias] || 'Resultado desconhecido.';
  }
}