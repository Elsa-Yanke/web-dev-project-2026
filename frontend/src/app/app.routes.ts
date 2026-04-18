import { Routes } from '@angular/router';

import { LoginComponent } from './components/sidebar/login.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { GameDetailComponent } from './components/game-detail/game-detail.component';
import { LibraryComponent } from './components/library/library.component'; 

export const routes: Routes = [
    { path: '', redirectTo: 'games', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'games', component: GameListComponent },
    { path: 'games/:id', component: GameDetailComponent },
    { path: 'library', component: LibraryComponent }, 

    { path: '**', redirectTo: 'games' }
];