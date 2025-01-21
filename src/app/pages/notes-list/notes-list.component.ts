import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FontAwesomeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
})
export class NotesListComponent implements OnInit {
  faTrash = faTrash;
  faPen = faPen;

  notes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5000/notes').subscribe(data => {
      this.notes = data;
    });
  }

  deleteNote(){
    console.log("ahoj");
  }
}