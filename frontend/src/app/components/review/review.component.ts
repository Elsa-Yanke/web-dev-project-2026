import { Component, OnInit, signal } from '@angular/core';
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
  reviews = signal<Review[]>([]);
  games = signal<Game[]>([]);
  currentUsername = signal('');
  selectedGameId = signal('');
  reviewText = signal('');
  isPositive = signal(true);

  loading = signal(false);
  formError = signal('');
  formSuccess = signal(false);

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    this.currentUsername.set(this.auth.getUsername());
    this.loadGames();
  }

  onGameSelect(id: string): void {
    this.selectedGameId.set(id);
    if (!id) return;
    this.loading.set(true);
    this.api.getReviews(Number(id)).subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadGames(): void {
    this.api.getGames().subscribe({
      next: (data) => this.games.set(data),
    });
  }

  submitReview(): void {
    this.formError.set('');
    this.formSuccess.set(false);

    if (!this.selectedGameId()) {
      this.formError.set('Select a game');
      return;
    }
    if (!this.reviewText().trim()) {
      this.formError.set('The review text is empty.');
      return;
    }

    this.api.createReview(
      Number(this.selectedGameId()),
      this.reviewText().trim(),
      this.isPositive()
    ).subscribe({
      next: (review) => {
        this.reviews.update(list => [review, ...list]);
        this.reviewText.set('');
        this.isPositive.set(true);
        this.formSuccess.set(true);
        setTimeout(() => this.formSuccess.set(false), 3000);
      },
      error: (err) => {
        this.formError.set(
          err.status === 400 ? 'Validation error' : `Server error: ${err.status}`
        );
      },
    });
  }

  deleteReview(id: number | undefined): void {
    if (!id || !this.selectedGameId()) return;
    this.api.deleteReview(Number(this.selectedGameId()), id).subscribe({
      next: () => this.reviews.update(list => list.filter(r => r.id !== id)),
      error: (err) => this.formError.set(`Failed to remove: ${err.status}`),
    });
  }
}
