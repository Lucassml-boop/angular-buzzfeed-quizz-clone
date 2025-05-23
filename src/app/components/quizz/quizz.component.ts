import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})


export class QuizzComponent implements OnInit {
  title: string = 'BuzzFeed Quiz';
  questions: any[] = [];
  questionSelected: any = { question: '', options: [] };

  answers: string[] = [];
  answerSelected: string = '';

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;
  loading: boolean = true;

  timeLeft: number = 10;
  interval: any;

  selectedAnswer: string | null = null;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
    this.loading = true;

    this.route.queryParams.subscribe((params) => {
      const quizId = params['id'];
      if (quizId) {
        this.loadQuiz(quizId); 
      } else {
        alert('ID do quiz não encontrado!');
        this.router.navigate(['/home']); 
      }
    });
  }

  loadQuiz(quizId: number): void {
    this.quizService.getQuestionsByQuizId(quizId).subscribe({
      next: (data) => {
        this.questions = this.shuffleArray(data);
        this.questionMaxIndex = this.questions.length;

        this.finished = false;
        this.questionIndex = 0;
        this.answers = [];
        this.questionSelected = this.questions[this.questionIndex];
        this.startTimer();

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
    this.selectedAnswer = value;
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
    this.selectedAnswer = null;
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
      this.finished = true;
      const finalAnswer: string = this.answers.length > 0 ? this.checkResult(this.answers) : '';
      this.answerSelected = this.getResultMessage(finalAnswer);
    }
  }

  checkResult(answers: string[]): string {
    if (answers.length === 0) {
      return '';
    }
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