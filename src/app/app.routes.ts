import { Routes } from '@angular/router';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { AddNoteComponent } from './pages/add-note/add-note.component';
import { NavbarComponent } from './navbar/navbar.component';

export const routes: Routes = [
    { path: '', redirectTo: '/notes', pathMatch: 'full' },
    { path: 'notes', component: NavbarComponent },
    { path: 'add-note', component: AddNoteComponent },
];


