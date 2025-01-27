import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`, {
      headers: this.getAuthHeaders()
    });
  }

  addNote(note: { title: string; content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-note`, note, {
      headers: this.getAuthHeaders()
    });
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-note/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateNote(
    id: number,
    note: { title: string; content: string }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-note/${id}`, note, {
      headers: this.getAuthHeaders()
    });
  }
}
