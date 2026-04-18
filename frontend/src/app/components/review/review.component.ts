import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Review, Game } from '../../models/game.model';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  games: Game[] = [];
currentUsername: string = ''; 
  newReview = { gameId: '', text: '', isPositive: true };

  loading = false;
  formError = '';
  formSuccess = false;

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  onGameSelect(id: string): void {
    if (!id) return;
    this.loading = true;
    this.api.getReviews(Number(id)).subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadGames(): void {
    this.api.getGames().subscribe({
      next: (data) => {
        this.games = data;
      },
    });
  }

  submitReview(): void {
    this.formError = '';
    this.formSuccess = false;

    if (!this.newReview.gameId) {
      this.formError = 'Select a game';
      return;
    }
    if (!this.newReview.text.trim()) {
      this.formError = 'The review text is empty.';
      return;
    }

    this.api.createReview(
      Number(this.newReview.gameId),
      this.newReview.text.trim(),
      this.newReview.isPositive
    ).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReview = { gameId: this.newReview.gameId, text: '', isPositive: true };
        this.formSuccess = true;
        setTimeout(() => (this.formSuccess = false), 3000);
      },
      error: (err) => {
        this.formError = err.status === 400
          ? 'Validation error'
          : `Server error: ${err.status}`;
      },
    });
  }

  deleteReview(id: number | undefined): void {
    if (!id || !this.newReview.gameId) return;

    this.api.deleteReview(Number(this.newReview.gameId), id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter((r) => r.id !== id);
      },
      error: (err) => {
        this.formError = `Failed to remove: ${err.status}`;
      },
    });
  }
}