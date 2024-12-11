//-----------------------------------
//   Fichier : journal.ts
//   Par:      Alain Martel
//   Date :    2024-10-21
//   Modiifié: 
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
  visible = false;
  btnArreterVisible = true;
  btnCommentaireVisible = true;
  btnChangerTache = true;
  btnStatsVisible = true;
  dlgCommentaireVisible = false;
  commCourant: Commentaire = new Commentaire();
  compteurTemps: Date = new Date()
  delai = 2000 // 2000 Millisecondes = 2 secondes
  tabSessTrav: SessionTravail[] = new Array();
  sessTravCourante: SessionTravail = new SessionTravail();
  tabCommentaires: Commentaire[] = new Array();
  tabFaits: Fait[] = new Array();
  @Output() changerTache = new EventEmitter<Developpeur>();
  @Output() quitterJournal = new EventEmitter<any>();


  //------------------------------------------------
  //
  //------------------------------------------------
  constructor(private jvSrv: JvService) {
  }

  ngOnInit()
  {
    setInterval(
      () => {
        this.timer()
      }, this.delai
    )
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  onConnexion(dev: Developpeur) {
    this.visible = true;
    this.btnArreterVisible = true;
    this.dev = dev;
    this.rafraichirJournal();
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  onDemarrerSessTrav(mesInfos: { dev: Developpeur, idTache: number },) {
    this.btnArreterVisible = true;
    this.btnChangerTache = true;
    this.btnCommentaireVisible = true;
    this.dev = mesInfos.dev;
    this.compteurTemps = new Date()
    this.visible = true;
    this.jvSrv.postSessionTravail(mesInfos.dev.id, mesInfos.idTache).subscribe(
      {
        next:
          idSessTrav => {

            this.rafraichirJournal();
          }
        ,
        error:
          err => {
            tr("Erreur 60 vérifiwer le serveur", true);
          }
      }
    )
  }

  //------------------------------------------------
  // Retourne le temps passée en format string.
  //------------------------------------------------
  timer() {
    if(this.sessTravCourante.fin == undefined)
    {
      this.compteurTemps = new Date(this.sessTravCourante.debut)
    }
    else
    {
      this.compteurTemps = new Date(this.sessTravCourante.fin)
    }

    let differences = (new Date().getTime() - this.compteurTemps.getTime())/1000

    if (differences > 10800) // plus que 180 minutes
      return (differences / 3600).toFixed(1) + " heures"
    else if (differences > 180) // plus que 180 seconds
      return (differences / 60).toFixed(1) + " minutes"
    else
      return differences.toFixed(1) + " secondes"
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  ouvrirStats() {
    tr("ouverture des stats");
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  changerDeTache() {
    this.visible = false;
    if (this.dev.etat == 'actif')
      this.arreterSessTrav();
    this.changerTache.emit(this.dev);
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  arreterSessTrav() {
    this.btnArreterVisible = false;
    this.btnCommentaireVisible = false;

    this.dev.etat = 'inactif';

    this.compteurTemps = new Date()

    let idSessTrav = this.tabSessTrav[this.tabSessTrav.length - 1].id;
    this.jvSrv.putSessionTravail(idSessTrav).subscribe(
      {
        next:
          nbSessTravMAJ => {
            this.rafraichirJournal();
          },

        error:
          err => {
            tr("Erreur 112 vérifiez le serveur");
          }
      }
    )
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  rafraichirJournal() {
    this.tabFaits = new Array();

    this.jvSrv.getCommPourUnDev(this.dev.id).subscribe({
      next:
        tabComm => {
          this.tabCommentaires = tabComm
        },
      error:
        err => {
          tr("Erreur 118 vérifiwer le serveur", true);
        }
    })

    this.jvSrv.getSessTravPourUnDev(this.dev.id).subscribe(
      {
        next:
          tabSessTrav => {
            // J'ai récupérer les sess trav de ce développeur
            this.tabSessTrav = tabSessTrav;
            this.sessTravCourante = this.tabSessTrav[this.tabSessTrav.length - 1];
            for (let i = 0; i < this.tabSessTrav.length; i++) {
              // Pour chaque session de travail on va chercher le debut et la fin
              this.tabFaits.push(new Fait(this.tabSessTrav[i]));

              if (this.tabSessTrav[i].fin != undefined) {
                // Traitement de la fin 
                this.tabFaits.push(new Fait(this.tabSessTrav[i], false))
              }
            }

            // Traitement des commentaires
            for (let i = 0; i < this.tabCommentaires.length; i++) {
              this.tabFaits.push(new Fait(this.tabSessTrav[0], false, this.tabCommentaires[i]))
            }

            this.tabFaits.sort(this.comparaisonDate);
            this.enleverDateRedondantes();
          },

        error:
          err => {
            tr("Erreur 117 vérifiwer le serveur", true);
          }
      }
    );
  }


  //------------------------------------------------
  //
  //------------------------------------------------
  comparaisonDate(f1: Fait, f2: Fait) {
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

  //------------------------------------------------
  //
  //------------------------------------------------
  enleverDateRedondantes() {
    let dateUnique = "9999-12-31";
    if (this.tabFaits[0] !== undefined) {
      dateUnique = this.tabFaits[0].date;
    }

    for (let i = 1; i < this.tabFaits.length; i++) {
      if (this.tabFaits[i].date === dateUnique)
        this.tabFaits[i].date = "";
      else
        dateUnique = this.tabFaits[i].date;
    }
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  commenter() {
    this.dlgCommentaireVisible = true;
    this.btnCommentaireVisible = false;
    this.btnArreterVisible = false;
    this.btnChangerTache = false;
    this.btnStatsVisible = false;
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  enregistrerCommentaire() {
    this.dlgCommentaireVisible = false;
    this.btnCommentaireVisible = true;
    this.btnArreterVisible = true;
    this.btnChangerTache = true;
    this.btnStatsVisible = true;


    this.jvSrv.postCommentaire(this.sessTravCourante.id, this.dev.id, this.commCourant.contenu).subscribe(
      {
        next:
          idNeoComm => {
            tr("Commentaire " + idNeoComm + " bien enregistré");
            this.tabCommentaires.push(this.commCourant);
            this.rafraichirJournal();
            this.commCourant = new Commentaire();
          },
        error:
          err => {
            tr("Erreur 218 véerifez le server", true);
          }
      }
    )

  }

  //------------------------------------------------
  //
  //------------------------------------------------
  annulerCommentaire() {
    this.commCourant = new Commentaire();
    this.dlgCommentaireVisible = false;
    this.btnCommentaireVisible = true;
    this.btnArreterVisible = true;
    this.btnChangerTache = true;
    this.btnStatsVisible = true;

  }


  //------------------------------------------------
  //
  //------------------------------------------------
  dateISO(d: Date) {
    return dateISO(d);
  }
}
