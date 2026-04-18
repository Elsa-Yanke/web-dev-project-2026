import { Component, OnInit } from '@angular/core';
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
  game?: Game;
  reviews: Review[] = [];
  
  reviewText = '';
  isPositive = true;

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
    this.api.getGame(id).subscribe(data => this.game = data);
    this.api.getReviews(id).subscribe(data => this.reviews = data);
  }

  sendReview(): void {
    if (!this.reviewText.trim() || !this.game) return;

    this.api.createReview(this.game.id, this.reviewText, this.isPositive).subscribe({
      next: (newReview) => {
        this.reviews.unshift(newReview); 
        this.reviewText = ''; 
        

        this.loadGameData(this.game!.id);
      },
      error: () => alert('Are you logged in?')
    });
  }
}