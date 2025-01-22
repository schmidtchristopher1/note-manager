import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import {HttpClientModule } from '@angular/common/http';

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
})
export class NotesListComponent implements OnInit {
  faTrash = faTrash;
  faPen = faPen;

  notes: Note[] = [];
  editingNote: Note | null = null;

  constructor(private notesService:NotesService) { }

  ngOnInit(): void {
    this.notesService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });
  }

  deleteNote(id: number) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.notesService.deleteNote(id).subscribe(() => {
        this.notes = this.notes.filter((note) => note.id !== id);
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

      this.notesService.updateNote(id, updatedNote).subscribe(() => {
        const note = this.notes.find((note) => note.id === id);
        if (note) {
          note.title = updatedNote.title;
          note.content = updatedNote.content;
        }
        this.editingNote = null;
      });
    }
  }
}