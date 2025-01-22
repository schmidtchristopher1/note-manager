import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FontAwesomeModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
})
export class NotesListComponent implements OnInit {
  faTrash = faTrash;
  faPen = faPen;

  notes: Note[] = [];
  editingNote: Note | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Note[]>('http://localhost:5000/notes').subscribe(data => {
      this.notes = data;
    });
  }

  deleteNote(id: number) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.http.delete(`http://localhost:5000/delete-note/${id}`).subscribe(() => {
        this.notes = this.notes.filter(note => note.id !== id);
      });
    }
  }

  startEdit(note: Note) {
    this.editingNote = { ...note };
  }

  cancelEdit() {
    this.editingNote = null;
  }

  updateNote(id: number) {
    if (this.editingNote?.title && this.editingNote?.content) {
      const updatedNote = {
        title: this.editingNote.title,
        content: this.editingNote.content
      };

      this.http.put(`http://localhost:5000/update-note/${id}`, updatedNote)
        .subscribe(() => {
          const index = this.notes.findIndex(n => n.id === id);
          if (index !== -1 && this.editingNote) {
            this.notes[index] = this.editingNote;
          }
          this.editingNote = null;
        });
    }
  }
}