import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css',
})
export class GameCardComponent {
  @Input() game!: Game;
  @Input() inLibrary = false;

  @Output() add = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();


  onAdd(): void {
    this.add.emit(this.game.id); 
  }

  onRemove(): void {
    this.remove.emit(this.game.id);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/placeholder.png';
  }
}