import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppComponent,
    CommonModule, 
    ReactiveFormsModule,
  ],
 
})
export class ModulesModule { }
