import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Developpeur } from '../modele/developpeur';
import { tr } from '../util';
import { Tache } from '../modele/tache';
import { tabTaches } from '../donnees/taches';
import { SessionTravail } from '../modele/sessionTravail';

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
  @Output() demarrerSesTrav= new EventEmitter<{dev:Developpeur,sess:SessionTravail}>();

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


  demarrerSessionTravail(idTac:number)
  {
    this.visible=false;
    let st = new SessionTravail();
    st.idTache = idTac;
    this.dev.etat = "actif";

    tr("Début d'une session de travail sur tache " + idTac );
    this.demarrerSesTrav.emit({dev:this.dev, sess:st});

  }

  onchangerTache(dev:Developpeur)
  {
    this.dev = dev;
    this.visible=true;
  }


  quitter()
  {
     this.visible = false;
     this.quitterLT.emit();

  }

}
