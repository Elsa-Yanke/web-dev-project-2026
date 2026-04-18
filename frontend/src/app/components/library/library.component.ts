import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LibraryGame } from '../../models/game.model';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit {
  myGames: LibraryGame[] = [];
  selectedStatus: string = 'all'; 

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadLibrary();
  }

  loadLibrary(): void {
    this.api.getGames().subscribe({
      next: (data: any) => {
        this.myGames = data;
      },
      error: (err) => console.error('Loading error:', err)
    });
  }

  setFilter(status: string): void {
    this.selectedStatus = status;
  }

  get filteredGames() {
    if (this.selectedStatus === 'all') {
      return this.myGames;
    }
    return this.myGames.filter(game => game.status === this.selectedStatus);
  }

  updateStatus(game: LibraryGame): void {
    this.api.updateGameStatus(game.id, game.status).subscribe();
  }

  removeGame(id: number): void {
    if (confirm('Delete the game?')) {
      this.api.deleteFromLibrary(id).subscribe({
        next: () => this.myGames = this.myGames.filter(g => g.id !== id)
      });
    }
  }

  get countPlaying() { return this.myGames.filter(g => g.status === 'playing').length; }
  get countPlanned() { return this.myGames.filter(g => g.status === 'planned').length; }
  get countCompleted() { return this.myGames.filter(g => g.status === 'finished').length; }
}