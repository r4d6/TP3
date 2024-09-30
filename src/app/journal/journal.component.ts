import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Developpeur } from '../modele/developpeur';
import { dateISO, tr } from '../util';
import { CommonModule } from '@angular/common';
import { SessionTravail } from '../modele/sessionTravail';
import { Fait } from '../modele/fait';
import { Commentaire } from '../modele/commentaire';

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

  historique: SessionTravail[] = new Array();
  tabCommentaires:Commentaire[] = new Array();
  tabFaits:Fait[] = new Array();
  @Output() changerTache = new EventEmitter<Developpeur>();
  @Output() quitterJournal=new EventEmitter<any>();


  onDemarrerSessTrav(mesInfos: {dev:Developpeur, sess:SessionTravail}, )
  {
    this.btnArreterVisible = true;
    this.dev = mesInfos.dev;
    //let sessTravCour = mesInfos.sess;
    this.historique.push(mesInfos.sess);
    this.visible=true;

    

    tr("Démarrage d'une session de travail sur la tache: " + mesInfos.sess.idTache);
    tr("Sess trav débute : " + dateISO(mesInfos.sess.debut));
    this.rafraichirJournal();
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
    let ind = this.historique.length - 1;
    this.historique[ind].fin = new Date();

    let duree = this.historique[ind].fin.getTime() - this.historique[ind].debut.getTime();
    let dureeTrunc = Math.trunc(duree/1000);
    tr("Cette sees de trav a duré : " + dureeTrunc + " secondes" );
    this.rafraichirJournal();
  }

  rafraichirJournal()
  {
    this.tabFaits = new Array();
    for(let i=0; i<this.historique.length; i++)
    {
      this.tabFaits.push(new Fait(this.historique[i]));

      let dateNulle = new Date('2100-01-01');
      if (this.historique[i].fin < dateNulle )
      {
        this.tabFaits.push(new Fait(this.historique[i], false))
      }
    }

    for(let i=0; i<this.tabCommentaires.length; i++)
    {
      this.tabFaits.push(new Fait(this.historique[0], false, this.tabCommentaires[i]))
    }

    this.tabFaits.sort(this.comparaisonDate);
    this.enleverDateRedondantes();
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
