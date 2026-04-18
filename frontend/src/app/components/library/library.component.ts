import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LibraryEntry } from '../../models/game.model';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit {
  entries = signal<LibraryEntry[]>([]);
  selectedStatus = signal<string>('all');

  filteredEntries = computed(() => {
    const status = this.selectedStatus();
    if (status === 'all') return this.entries();
    return this.entries().filter(e => e.status === status);
  });

  countPlaying = computed(() => this.entries().filter(e => e.status === 'playing').length);
  countPlanned = computed(() => this.entries().filter(e => e.status === 'planned').length);
  countCompleted = computed(() => this.entries().filter(e => e.status === 'finished').length);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadLibrary();
  }

  loadLibrary(): void {
    this.api.getLibrary().subscribe({
      next: (data) => this.entries.set(data),
      error: (err) => console.error('Loading error:', err)
    });
  }

  setFilter(status: string): void {
    this.selectedStatus.set(status);
  }

  updateStatus(entry: LibraryEntry, newStatus: string): void {
    this.api.updateLibraryEntry(entry.id, { status: newStatus }).subscribe();
    this.entries.update(list =>
      list.map(e => e.id === entry.id ? { ...e, status: newStatus } : e)
    );
  }

  removeGame(id: number): void {
    if (confirm('Delete the game?')) {
      this.api.deleteFromLibrary(id).subscribe({
        next: () => this.entries.update(list => list.filter(e => e.id !== id))
      });
    }
  }

  coverSrc(entry: LibraryEntry): string {
    return entry.game.cover_image ? `covers/${entry.game.cover_image}` : '';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
