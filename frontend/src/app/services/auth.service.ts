import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private ACCESS_KEY  = 'jwt_access';
  private REFRESH_KEY = 'jwt_refresh';

  constructor(private api: ApiService, private router: Router) {}

  login(username: string, password: string) {
    return this.api.login(username, password).pipe(
      tap(tokens => {
        localStorage.setItem(this.ACCESS_KEY,  tokens.access);
        localStorage.setItem(this.REFRESH_KEY, tokens.refresh);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
