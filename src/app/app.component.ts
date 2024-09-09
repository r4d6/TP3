import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnexionComponent} from './connexion/connexion.component';
import { ListeTachesComponent } from './liste-taches/liste-taches.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConnexionComponent,ListeTachesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  titre = 'Jourvie 24';
}
