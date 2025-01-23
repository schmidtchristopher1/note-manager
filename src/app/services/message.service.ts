import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messagesSubject = new Subject<{ type: string, text: string }>();
  messages$ = this.messagesSubject.asObservable();

  showMessage(type: string, text: string): void {
    this.messagesSubject.next({ type, text });
  }

  showSuccessMessage(text: string): void {
    this.showMessage('success', text);
  }

  showErrorMessage(text: string): void {
    this.showMessage('danger', text);
  }

  showWarningMessage(text: string): void {
    this.showMessage('warning', text);
  }

}
