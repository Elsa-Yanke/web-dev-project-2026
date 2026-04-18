import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game, Review, AuthTokens } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) {}

  
  login(username: string, password: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.base}/auth/login/`, { username, password });
  }

  register(payload: any): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.base}/auth/register/`, payload);
  }

  logout(refresh: string): Observable<any> {
    return this.http.post(`${this.base}/auth/logout/`, { refresh });
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.base}/games/`);
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.base}/games/${id}/`);
  }

  getReviews(gameId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.base}/games/${gameId}/reviews/`);
  }

  createReview(gameId: number, text: string, isPositive: boolean): Observable<Review> {
    const payload = { text, is_positive: isPositive };
    return this.http.post<Review>(`${this.base}/games/${gameId}/reviews/`, payload);
  }

  deleteReview(gameId: number, reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/games/${gameId}/reviews/${reviewId}/`);
  }

addToLibrary(gameId: number): Observable<any> {
  return this.http.post(`${this.base}/user-games/`, { game: gameId });
}

  updateGameStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.base}/library/${id}/`, { status });
  }

  deleteFromLibrary(id: number): Observable<any> {
    return this.http.delete(`${this.base}/library/${id}/`);
  }

  getGenres(): Observable<string[]> {
  return this.http.get<string[]>(`${this.base}/genres/`);
}
}