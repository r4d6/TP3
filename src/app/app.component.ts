import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnexionComponent} from './connexion/connexion.component';
import { ListeTachesComponent } from './liste-taches/liste-taches.component';
import { JournalComponent } from './journal/journal.component';
import { Developpeur } from './modele/developpeur';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConnexionComponent,ListeTachesComponent, JournalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  titre = 'Jourvie 24';
  dev = new Developpeur();

  onConnexion(dev:Developpeur)
  {
     this.dev = dev;
     this.titre += ", " + this.dev.prenom + " " + this.dev.nom + " ( " + this.dev.nomProjet + " )";
  }

}
