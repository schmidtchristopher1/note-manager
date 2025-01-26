import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../services/auth.service';
import {MessageService} from '../services/message.service';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  faRightFromBracket = faRightFromBracket;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private as: AuthService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    const token = this.as.getToken();
    this.isLoggedIn = token !== null;
    this.messageService.setLoggedIn(this.isLoggedIn);

    this.messageService.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/notes']);
    }
  }

  logout(): void {
    if (window.confirm('Are you sure you want to log out?')) {
      this.as.logout();
      this.router.navigate(['/login']);
      this.messageService.showWarningMessage('You have been logged out');
    }
  }
}
