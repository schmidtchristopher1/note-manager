import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  setToken(token: string) {
    localStorage.setItem('access_token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  removeToken() {
    localStorage.removeItem('access_token');
  }
}
