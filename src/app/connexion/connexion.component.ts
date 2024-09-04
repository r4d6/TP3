import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { tr } from '../util';


@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  matricule:string="";
  motDePasse="";

  validerConnexion()
  {
    tr("tentative de connexion de " + this.matricule + " avec le mot de passe:" + this.motDePasse);
    this.triche()

    for(let i=0; i < tabDeveloppeurs.length; i++)
    {
      if (this.matricule === tabDeveloppeurs[i].matricule)
    }

  }

  triche()
  {
    if (this.matricule.length == 0)
    {
       this.matricule = "1111111";
       this.motDePasse = "11";
    }
  }

}
