import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Developpeur } from '../modele/developpeur';
import { tr } from '../util';
import { Tache } from '../modele/tache';
import { tabTaches } from '../donnees/taches';

@Component({
  selector: 'app-liste-taches',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-taches.component.html',
  styleUrl: './liste-taches.component.css'
})
export class ListeTachesComponent {
  visible=false;
  listeTac:Tache[] = new Array();
  dev = new Developpeur();

  @Output() quitterLT=new EventEmitter<any>();

  onConnexion(dev:Developpeur)
  {
     this.listeTac = new Array();
     this.dev = dev;

     for(let i=0; i<tabTaches.length; i++)
     {
       if(tabTaches[i].idProjet == this.dev.idProjet)
       {
          this.listeTac.push(tabTaches[i]);
       }
     }
     this.visible=true;
     tr(dev.prenom + " " + dev.nom + " connexion réussie!");
  }

  quitter()
  {
     this.visible = false;
     this.quitterLT.emit();

  }

}
