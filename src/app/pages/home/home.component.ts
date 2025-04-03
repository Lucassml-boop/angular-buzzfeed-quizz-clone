import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  quizzes = [
    {
      id: 1,
      title: 'Você seria um herói ou vilão?',
      description: 'Descubra se você seria um super-herói ou um supervilão!'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  startQuiz(quizId: number): void {
    this.router.navigate(['/quiz'], { queryParams: { id: quizId } });
  }
}