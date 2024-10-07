  //-----------------------------------
  //   Fichier : connexion.component.ts
  //   Par:      Alain Martel
  //   Date :    2024-09-09
  //-----------------------------------
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tr } from '../util';
import { tabDeveloppeurs } from '../donnees/developpeurs';
import { Developpeur } from '../modele/developpeur';
import { JvService } from '../jv.service';


@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  visible=true;
  matricule:string="";
  motDePasse="";
  dev:Developpeur = new Developpeur();

  constructor(private jvSrv:JvService)
  {}

  @Output() ConnexionReussie = new EventEmitter<Developpeur>();

  //-----------------------------------
  // 
  //-----------------------------------
  validerConnexion()
  {
    let trouve=false;
    this.triche();
    tr("tentative de connexion de " + this.matricule + " avec le mot de passe:" + this.motDePasse);

    this.jvSrv.getConnexion().subscribe(
      
    )


    /*for(let i=0; i < tabDeveloppeurs.length; i++)
    {
      if (this.matricule === tabDeveloppeurs[i].matricule)
      {
         if (this.motDePasse === tabDeveloppeurs[i].motDePasse)
         {
            trouve=true;
            this.visible= false;
            this.dev = tabDeveloppeurs[i];
            this.ConnexionReussie.emit(this.dev);

            break;
         }
      }
    }*/
    if (trouve)
      tr("Bingo");
    else
      tr("Erreur de connexion", true);
  }

  //-----------------------------------
  // 
  //-----------------------------------
  triche()
  {
    if (this.matricule.length == 0)
    {
       this.matricule = "1111111";
       this.motDePasse = "11";
    }
  }

  onQuitter()
  {
    this.matricule = "";
    this.motDePasse = "";
    this.visible=true;
  }

}
