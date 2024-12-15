import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from '../../services/notes.service';


@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css'],
})
export class AddNoteComponent {
  noteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notesService: NotesService
  ) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  submit(): void {
    if (this.noteForm.valid) {
      this.notesService.addNote(this.noteForm.value).subscribe({
        next: () => alert('Poznámka pridaná!'),
        error: (err) => console.error('Chyba pri pridávaní poznámky:', err),
      });
    }
  }
}
