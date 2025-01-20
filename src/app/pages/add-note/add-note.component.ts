import { Component } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css'],
})
export class AddNoteComponent {
  note = {
    title: '',
    content: ''
  };

  constructor(private http: HttpClient) { }

  addNote(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:5000/add-note', this.note, { headers }).subscribe(response => {
      console.log('Note added', response);
      this.note = { title: '', content: '' };
    });
  }
}