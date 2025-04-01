import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:3000/questions';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}