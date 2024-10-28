//-----------------------------------
  //   Fichier : 
  //   Par:      Alain Martel
  //   Date :    2024-10-21
  //   modifié par : 
  //-----------------------------------

  export class Developpeur{
    id:number;
    nom:string;
    prenom:string;
    matricule:string;
    motDePasse:string;
    idProjet:number;
    nomProjet="";
    etat:string;

    constructor()
    {
        this.id=0;
        this.nom="";
        this.prenom="";
        this.matricule="";
        this.motDePasse="";
        this.idProjet=0;
        this.etat="inactif";
    }
}