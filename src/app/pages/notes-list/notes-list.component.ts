import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService, Note } from '../../services/notes.service';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
})
export class NotesListComponent implements OnInit {
  notes: Note[] = [];

  constructor(@Inject(NotesService) private notesService: NotesService) { }

  ngOnInit(): void {
    this.notesService.getNotes().subscribe({
      next: (data: Note[]) => (this.notes = data),
      error: (err: any) => console.error('Chyba pri načítaní poznámok:', err),
    });
  }
}