import { Component, EventEmitter, Output } from '@angular/core';
import { Developpeur } from '../modele/developpeur';
import { dateISO, tr } from '../util';
import { CommonModule } from '@angular/common';
import { SessionTravail } from '../modele/sessionTravail';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.css'
})
export class JournalComponent {
  dev = new Developpeur()
  visible=false;
  historique: SessionTravail[] = new Array();
  @Output() changerTache = new EventEmitter<Developpeur>();


  onDemarrerSessTrav(mesInfos: {dev:Developpeur, sess:SessionTravail}, )
  {
    this.dev = mesInfos.dev;
    //let sessTravCour = mesInfos.sess;
    this.historique.push(mesInfos.sess);
    this.visible=true;
    tr("Démarrage d'une session de travail sur la tache: " + mesInfos.sess.idTache);
    tr("Sess trav débute : " + dateISO(mesInfos.sess.debut));
  }

  quitter()
  {

  }

  changerDeTache()
  {
    this.visible=false;
    this.arreterSessTrav();
    this.changerTache.emit(this.dev);


  }

  arreterSessTrav()
  {
    this.dev.etat='inactif';
    let ind = this.historique.length - 1;
    this.historique[ind].fin = new Date();

    let duree = this.historique[ind].fin.getTime() - this.historique[ind].debut.getTime();
    let dureeTrunc = Math.trunc(duree/1000);
    tr("Cette sees de trav a duré : " + dureeTrunc + " secondes" );
  }

  dateISO(d:Date)
  {
     return dateISO(d);
  }
}
