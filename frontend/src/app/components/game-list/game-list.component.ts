import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { GameCardComponent } from '../game-card/game-card.component';
import { ReviewComponent } from '../review/review.component';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule, GameCardComponent, ReviewComponent],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent implements OnInit {
  games = signal<Game[]>([]);
  genres = signal<string[]>(['All']);
  selectedGenre = signal<string>('All');
  loading = signal(true);
  errorMessage = signal('');

  filteredGames = computed(() => {
    const genre = this.selectedGenre();
    if (genre === 'All') return this.games();
    return this.games().filter(g => g.genre?.name === genre);
  });

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.loading.set(true);
    this.api.getGames().subscribe({
      next: (data) => {
        this.games.set(data);
        const unique = Array.from(new Set(data.map(g => g.genre?.name).filter(Boolean)));
        this.genres.set(['All', ...unique]);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load games. Is the backend running?');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  setGenre(genre: string): void {
    this.selectedGenre.set(genre);
  }

  onAddGame(event: { gameId: number; status: string }): void {
    this.api.addToLibrary(event.gameId, event.status).subscribe({
      next: () => alert('Game added to library!'),
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          alert('Login required to add games!');
        } else if (err.status === 400) {
          alert(err.error?.detail || 'Game already in library.');
        } else {
          alert(`Error ${err.status}: ${err.error?.detail || 'Something went wrong'}`);
        }
      }
    });
  }

  onRemoveGame(gameId: number): void {
    console.log('Remove request for ID:', gameId);
  }
}
