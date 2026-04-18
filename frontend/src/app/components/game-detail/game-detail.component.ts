import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Game, Review } from '../../models/game.model';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.css'
})
export class GameDetailComponent implements OnInit {
  game = signal<Game | null>(null);
  reviews = signal<Review[]>([]);

  reviewText = signal('');
  isPositive = signal(true);

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadGameData(id);
    }
  }

  loadGameData(id: number): void {
    this.api.getGame(id).subscribe(data => this.game.set(data));
    this.api.getReviews(id).subscribe(data => this.reviews.set(data));
  }

  sendReview(): void {
    const g = this.game();
    if (!this.reviewText().trim() || !g) return;

    this.api.createReview(g.id, this.reviewText(), this.isPositive()).subscribe({
      next: (newReview) => {
        this.reviews.update(list => [newReview, ...list]);
        this.reviewText.set('');
        this.loadGameData(g.id);
      },
      error: () => alert('Are you logged in?')
    });
  }
}
