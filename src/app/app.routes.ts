import { Routes } from '@angular/router';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { AddNoteComponent } from './pages/add-note/add-note.component';
import { LoginComponent } from './pages/login/login.component';


export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    { path: 'notes', component: NotesListComponent },
    { path: 'add-note', component: AddNoteComponent },
];


