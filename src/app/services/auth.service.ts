import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';

  

  constructor(private http:HttpClient, private messageService:MessageService) { }



  setToken(token: string) {
    localStorage.setItem('access_token', token);
    this.messageService.setLoggedIn(true);
  }
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    this.messageService.setLoggedIn(false);
  }

  login(username: string, password: string): Observable<{ access_token: string, message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<{ access_token: string, message:string }>(`${this.apiUrl}/login`, { username, password }, { headers });
  
  }
  


}
