import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Developpeur } from '../modele/developpeur';
import { tr } from '../util';
import { Tache } from '../modele/tache';
import { SessionTravail } from '../modele/sessionTravail';
import { JvService } from '../jv.service';

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
  @Output() demarrerSesTrav= new EventEmitter<{dev:Developpeur,idTache:number}>();

  constructor(private jvSrv:JvService)
  {}

  onConnexion(dev:Developpeur)
  {
     this.listeTac = new Array();
     this.dev = dev;

     this.jvSrv.getTaches(dev.idProjet).subscribe(
       {
          next:
            tabTac =>
            {
              tr("Recup de " + tabTac.length + " tâches");
              this.listeTac = tabTac;
            },

          error:
            err=>
              {
                tr("Erreur 44 HTTP: Vérifiez le serveur", true, true);
              }  
       }
     );

    

     /*for(let i=0; i<tabTaches.length; i++)
     {
       if(tabTaches[i].idProjet == this.dev.idProjet)
       {
          this.listeTac.push(tabTaches[i]);
       }
     }*/
     this.visible=true;
     tr(dev.prenom + " " + dev.nom + " connexion réussie!");
  }


  demarrerSessionTravail(idTac:number)
  {
    //tr("id tac 65:" + idTac, true);

    this.visible=false;
    //let st = new SessionTravail();
    //st.idTache = idTac;
    
    this.dev.etat = "actif";

    tr("Début d'une session de travail sur tache " + idTac );
    this.demarrerSesTrav.emit({dev:this.dev, idTache:idTac});

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
