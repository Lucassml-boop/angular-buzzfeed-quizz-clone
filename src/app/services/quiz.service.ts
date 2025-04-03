import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getQuizzes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/quizzes`);
  }

  getQuestionsByQuizId(quizId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/questions?quizId=${quizId}`);
  }
  
  getResults(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/results`);
  }
}