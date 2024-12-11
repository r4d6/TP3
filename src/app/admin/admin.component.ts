//-----------------------------------
//   Fichier : 
//   Par:      David Moussette
//   Date :    2024-12-11
//   modifié par : 
//-----------------------------------

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JvService } from '../jv.service';
import { tr } from '../util';
import { SessionTravail } from '../modele/sessionTravail';
import { Developpeur } from '../modele/developpeur';
import { Projet } from '../modele/projet';
import { Commentaire } from '../modele/commentaire';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  visible = false
  buttonSession = false
  buttonSommaire = false
  sessionsVisible = false
  sommaireVisible = false
  detailDevVisible = false
  devDetail:Developpeur = new Developpeur()
  tabSessTrav: SessionTravail[] = new Array()
  tabDevs: Developpeur[] = new Array()
  tabProjets: Projet[] = new Array()
  tabComm: Commentaire[] = new Array()
  
  constructor(private jvSrv: JvService) { }

  //------------------------------------------------
  // 
  //------------------------------------------------
  onConnexion() {
    this.visible = true

    this.switchSessions()

    this.jvSrv.getSessTravs().subscribe(
      {
        next:
          tabSessTrav => {
            this.tabSessTrav = tabSessTrav

          }
        ,
        error:
          err => {
            tr("Erreur A0 vérifiwer le serveur", true);
          }
      }
    )

    this.jvSrv.getDeveloppeurs().subscribe(
      {
        next:
          tabDevs => {
            this.tabDevs = tabDevs
          }
        ,
        error:
          err => {
            tr("Erreur A1 vérifiwer le serveur", true);
          }
      }
    )

    this.jvSrv.getProjets().subscribe(
      {
        next:
          tabProj => {
            this.tabProjets = tabProj

          }
        ,
        error:
          err => {
            tr("Erreur A2 vérifiwer le serveur", true);
          }
      }
    )

    this.jvSrv.getCommentaires().subscribe(
      {
        next:
          tabComm => {
            this.tabComm = tabComm

          }
        ,
        error:
          err => {
            tr("Erreur A3 vérifiwer le serveur", true);
          }
      }
    )

  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  switchSommaire() {
    this.sessionsVisible = false
    this.sommaireVisible = true
    this.detailDevVisible = false
    this.buttonSession = true
    this.buttonSommaire = false
  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  switchSessions() {
    this.sessionsVisible = true
    this.sommaireVisible = false
    this.detailDevVisible = false
    this.buttonSommaire = true
    this.buttonSession = false
  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  switchDetailDev(dev:Developpeur)
  {
    this.devDetail = dev
    this.sommaireVisible = false
    this.sessionsVisible = false
    this.detailDevVisible = true
    this.buttonSommaire = true
    this.buttonSession = true
  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  getMinutesSession(date: string) {
    let differences = (new Date().getTime() - new Date(date).getTime()) / 1000
    return (differences / 60).toFixed(1)
  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  getHeuresSession(debut: string, fin: string = Date()) {
      let differences = (new Date(fin).getTime() - new Date(debut).getTime()) / 1000
      return (differences / 3600).toFixed(1)
  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  getSessionCommCount(session: SessionTravail) {
    let count = 0
    this.tabComm.forEach(element => {
      if (element.idSession == session.id) {
        count++
      }
    });
    return count
  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  getDevCommCount(dev: Developpeur) {
    let count = 0
    this.tabComm.forEach(element => {
      if (element.idDev == dev.id) {
        count++
      }
    });
    return count
  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  getDevSessCount(dev: Developpeur) {
    let count = 0
    this.tabSessTrav.forEach(element => {
      if (element.idDev == dev.id) {
        count++
      }
    });
    return count
  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  getDevSumHours(dev: Developpeur) {
    let sum = 0
    this.tabSessTrav.forEach(element => {
      if (element.idDev == dev.id) {
        sum += parseFloat(this.getHeuresSession(element.debut, element.fin == null ? undefined : element.fin))
      }
    });
    return sum.toFixed(1)
  }

  //------------------------------------------------
  // 
  //------------------------------------------------
  getProjetNameFromID(id: number) {
    let nom = ""
    this.tabProjets.forEach(element => {
      if (element.id == id) {
        nom = element.nom
      }
    });
    return nom
  }

  
  //------------------------------------------------
  // Those are supposed to sort the list of devs, but there's an undefined error somehow.
  //------------------------------------------------
  sortDevs()
  {
    this.tabDevs.sort(this.comparaisonDev)
  }

  comparaisonDev(d1: Developpeur, d2: Developpeur) {
    let h1 = parseFloat(this.getDevSumHours(d1))
    let h2 = parseFloat(this.getDevSumHours(d2))
    if (h1 > h2)
      return -1;
    if (h1 < h2)
      return 1;

    return 0;
  }
}
