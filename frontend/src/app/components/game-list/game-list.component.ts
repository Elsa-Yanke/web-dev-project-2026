import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { GameCardComponent } from '../game-card/game-card.component'; 
import {ReviewComponent} from '../review/review.component'
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule, GameCardComponent, ReviewComponent],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent implements OnInit {
  games: Game[] = [];
  genres: string[] = ['All']; 
  selectedGenre: string = 'All';
  loading = true;
  errorMessage = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadGames();
    this.loadGenres(); 
  }

  loadGenres(): void {
    this.api.getGenres().subscribe({
      next: (data: any[]) => {
        const genreNames = data.map(g => typeof g === 'string' ? g : g.name);
        this.genres = ['All', ...genreNames];
      },
      error: () => console.error('Не удалось загрузить жанры')
    });
  }

  loadGames(): void {
    this.loading = true;
    this.api.getGames().subscribe({
      next: (data) => {
        this.games = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load games.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  setGenre(genre: string): void {
    this.selectedGenre = genre;
  }

  get filteredGames(): Game[] {
    if (this.selectedGenre === 'All') return this.games;
    return this.games.filter(game => game.genre?.name === this.selectedGenre);
  }

  onAddGame(gameId: number): void {
    this.api.addToLibrary(gameId).subscribe({
      next: () => console.log('Added to library:', gameId),
      error: (err) => alert('Login required to add games!')
    });
  }

  onRemoveGame(gameId: number): void {
    console.log('Remove request for ID:', gameId);
  }
}