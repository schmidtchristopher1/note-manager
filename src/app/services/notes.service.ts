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

  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  addNote(note: { title: string; content: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/add-note`, note, { headers });
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-note/${id}`);
  }

  updateNote(id: number, note: { title: string; content: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.apiUrl}/update-note/${id}`, note, { headers });
  }
}