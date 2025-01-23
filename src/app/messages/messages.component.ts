import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  messages: { type: string, text: string }[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.messages$.subscribe(message => {
      if (message) {
        this.messages.push(message);
        setTimeout(() => {this.removeMessage(message);}, 5000);
      } else {
        this.messages = [];
      }
    });
  }

  removeMessage(message: { type: string, text: string }): void {
    this.messages = this.messages.filter(m => m !== message);
  } 

}
