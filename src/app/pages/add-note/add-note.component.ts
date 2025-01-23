import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from '../../services/message.service';

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

  constructor(private notesService: NotesService, private messageService: MessageService) { }

  addNote(): void {
    this.notesService.addNote(this.note).subscribe(response => {
      this.messageService.showSuccessMessage(response.message);
      this.note = { title: '', content: '' };
    });
  }
}