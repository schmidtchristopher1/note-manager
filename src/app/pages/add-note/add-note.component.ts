import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css'],
})
export class AddNoteComponent {
  note = {
    title: '',
    content: ''
  };

  constructor(private notesService: NotesService) { }

  addNote(): void {
    this.notesService.addNote(this.note).subscribe(response => {
      console.log('Note added', response);
      this.note = { title: '', content: '' };
    });
  }
}