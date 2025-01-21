import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {

  router = inject(Router);
  as = inject(AuthService);

  constructor() {
    const token = this.as.getToken();
    if (token == null) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/notes']);
    }
  }
}
