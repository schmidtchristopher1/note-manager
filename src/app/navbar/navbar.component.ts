import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageService } from '../services/message.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {

  faRightFromBracket = faRightFromBracket;

  router = inject(Router);
  as = inject(AuthService);

  constructor(private messageService: MessageService) { 
    const token = this.as.getToken();
    if (token == null) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/notes']);
    }
  }

  logout(): void {
    this.as.logout();
    this.router.navigate(['/login']);
    this.messageService.showWarningMessage('You have been logged out');
    
  }
}
