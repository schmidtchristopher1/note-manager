import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  router = inject(Router);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const logindata = { username, password };
      console.log(logindata);
      this.http.post<{ access_token: string }>('http://localhost:5000/login', { username, password })
        .subscribe({
          next: (response) => {
            console.log(response)
            this.authService.setToken(response.access_token);
            console.log('Login successful');
            console.log('Token:', response.access_token);
            this.router.navigate(['/notes']);
          },
          error: (error) => {
            console.error('Login failed', error);
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }
}






