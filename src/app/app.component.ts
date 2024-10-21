//-----------------------------------
  //   Fichier : 
  //   Par:      Alain Martel
  //   Date :    2024-10-21
  //-----------------------------------

  import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnexionComponent} from './connexion/connexion.component';
import { ListeTachesComponent } from './liste-taches/liste-taches.component';
import { JournalComponent } from './journal/journal.component';
import { Developpeur } from './modele/developpeur';
import { JvService } from './jv.service';
import { tr } from './util';

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

  constructor(private jvSrv:JvService)
  {

     
  }

  onQuitterLT()
  {
    this.titre = 'Jourvie 24';
  }

  onConnexion(dev:Developpeur)
  {
     this.jvSrv.getProjets().subscribe(
      {
        next:
          projets =>
        {
           tr("get proj OK");
           for(let i=0; i<projets.length; i++)
           {
              if (projets[i].id == dev.idProjet)
              {
                 this.dev = dev;
                 this.dev.nomProjet = projets[i].nom;
                 this.titre = "Jourvie 24, " + this.dev.prenom + " " + this.dev.nom + " ( " + this.dev.nomProjet + " )";
              }
           }
        },
        error:
          err =>
        {
          tr("Erreur 38: problème avec le serveur");
        }
      }   
    );
     
  }

}
