import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = { 
    username: '',
    password: '',
    errorMsg: '', 
  };

  constructor(
    private auth: AuthService, 
    private router: Router
  ) {}

  login(): void {
    this.loginData.errorMsg = '';

    if (!this.loginData.username || !this.loginData.password) {
      this.loginData.errorMsg = 'Please enter both username and password.';
      return;
    }

    this.auth.login(this.loginData.username, this.loginData.password).subscribe({
      next: () => {
        console.log('Login successful!');
        this.router.navigate(['/catalog']); 
      },
      error: (err) => {
        console.error(err);
        if (err.status === 401) {
          this.loginData.errorMsg = 'Invalid username or password.';
        } else {
          this.loginData.errorMsg = 'An error occurred. Is the backend running?';
        }
      }
    });
  }
}