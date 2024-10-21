//-----------------------------------
  //   Fichier : 
  //   Par:      Alain Martel
  //   Date :    2024-10-21
  //-----------------------------------

import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Developpeur } from '../modele/developpeur';
import { dateISO, tr } from '../util';
import { CommonModule } from '@angular/common';
import { SessionTravail } from '../modele/sessionTravail';
import { Fait } from '../modele/fait';
import { Commentaire } from '../modele/commentaire';
import { JvService } from '../jv.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.css'
})
export class JournalComponent {
  dev = new Developpeur()
  visible=false;
  btnArreterVisible=true;
  dlgCommentaireVisible=false;
  commCourant:Commentaire = new Commentaire();

  tabSessTrav: SessionTravail[] = new Array();
  tabCommentaires:Commentaire[] = new Array();
  tabFaits:Fait[] = new Array();
  @Output() changerTache = new EventEmitter<Developpeur>();
  @Output() quitterJournal=new EventEmitter<any>();

  constructor(private jvSrv:JvService)
  {

  }


  onDemarrerSessTrav(mesInfos: {dev:Developpeur, idTache:number}, )
  {
    this.btnArreterVisible = true;
    this.dev = mesInfos.dev;
    //let sessTravCour = mesInfos.sess;
//    this.tabSessTrav.push(mesInfos.sess);
    this.visible=true;

    //tr("id tac:" + mesInfos.idTache, true);

    this.jvSrv.postSessionTravail(mesInfos.dev.id, mesInfos.idTache).subscribe(
       {
         next:
           idSessTrav=>
           {
             //tr("La sess trav " + idSessTrav + " a été insérée", true);
             this.rafraichirJournal();
           }
           ,
         error:
           err=>
           {
            tr("Erreur 60 vérifiwer le serveur");
           }
       }
    )

    //tr("Démarrage d'une session de travail sur la tache: " + mesInfos.idTac);
    //tr("Sess trav débute : " + dateISO(mesInfos.sess.debut));

    // Insérer le code qui contacte le serveur pour inserer la sess travail

  }

  quitter()
  {
    this.visible = false;
    this.quitterJournal.emit();
  }

  ouvrirStats()
  {
    tr("ouverture des stats");
  }

  changerDeTache()
  {
    this.visible=false;
    this.arreterSessTrav();
    this.changerTache.emit(this.dev);
  }

  arreterSessTrav()
  {
    this.btnArreterVisible = false;
    this.dev.etat='inactif';
    let ind = this.tabSessTrav.length - 1;
    this.tabSessTrav[ind].fin = "";

    let duree = 13000; //this.tabSessTrav[ind].fin.getTime() - this.tabSessTrav[ind].debut.getTime();
    let dureeTrunc = Math.trunc(duree/1000);
    tr("Cette sees de trav a duré : " + dureeTrunc + " secondes" );
    this.rafraichirJournal();
  }

  rafraichirJournal()
  {
    this.tabFaits = new Array();

    this.jvSrv.getSessTravPourUnDev(this.dev.id).subscribe(
      {
        next:
          tabSessTrav=>
          {
            //tr("Reception de " + tabSessTrav.length + " sess trav", true);
            this.tabSessTrav = tabSessTrav; 
            for(let i=0; i<this.tabSessTrav.length; i++)
              {
                this.tabFaits.push(new Fait(this.tabSessTrav[i]));
          
                let dateNulle = new Date('2100-01-01');
                if (this.tabSessTrav[i].fin != undefined)
                {
                  this.tabFaits.push(new Fait(this.tabSessTrav[i], false))
                }
              }
          
              for(let i=0; i<this.tabCommentaires.length; i++)
              {
                this.tabFaits.push(new Fait(this.tabSessTrav[0], false, this.tabCommentaires[i]))
              }
          
              this.tabFaits.sort(this.comparaisonDate);
              this.enleverDateRedondantes();
          },

        error: 
          err=>
          {
           tr("Erreur 117 vérifiwer le serveur");
          } 
      }
    );



  } 


  comparaisonDate(f1:Fait, f2:Fait)
  {
    if (f1.date > f2.date)
      return -1;
    if (f1.date < f2.date)
      return 1;

    if (f1.heure > f2.heure)
      return -1
    if (f1.heure < f2.heure)
      return 1;

    return 0;

  }

  enleverDateRedondantes()
  {
    let dateUnique = "9999-12-31";
    if (this.tabFaits[0] !== undefined)
    {
      dateUnique = this.tabFaits[0].date;
    }

    for(let i=1; i<this.tabFaits.length; i++)
    {
      if(this.tabFaits[i].date === dateUnique)
        this.tabFaits[i].date = "";
      else
        dateUnique = this.tabFaits[i].date;
    }
  }

  commenter()
  {
    //tr("Commneter", true);
    this.dlgCommentaireVisible = true;
  }

  enregistrerCommentaire()
  {
    this.dlgCommentaireVisible = false;
    this.commCourant.horodateur = new Date();
    this.tabCommentaires.push(this.commCourant);
    this.commCourant = new Commentaire();
    this.rafraichirJournal();
  }

  annulerCommentaire()
  {
    this.dlgCommentaireVisible = false;
  }


  dateISO(d:Date)
  {
     return dateISO(d);
  }
}
