//-----------------------------------
//   Fichier : jv.service.ts
//   Par:      Alain Martel
//   Date :    2024-12-11
//   Modifié par: David Moussette
//-----------------------------------

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Tache } from './modele/tache';
import { Developpeur } from './modele/developpeur';
import { Projet } from './modele/projet';
import { urlSrv } from './util';
import { SessionTravail } from './modele/sessionTravail';
import { Commentaire } from './modele/commentaire';

@Injectable({
  providedIn: 'root'
})
export class JvService {

  //------------------------------------------------
  //
  //------------------------------------------------
  constructor(private http: HttpClient) { }

  //------------------------------------------------
  //
  //------------------------------------------------
  getDeveloppeurs() {
    let url = urlSrv + "getDeveloppeurs.php";
    return this.http.get<Developpeur[]>(url);
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  getCommentaires() {
    let url = urlSrv + "getCommentaires.php";
    return this.http.get<Commentaire[]>(url);
  }
  //------------------------------------------------
  //
  //------------------------------------------------
  getConnexion(pMat: string, pMdp: string) {
    let url = urlSrv + "getConnexion.php";
    let params: HttpParams = new HttpParams(
      {
        fromObject:
        {
          mat: pMat,
          mdp: pMdp
        }
      }
    );
    return this.http.post<Developpeur>(url, params);
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  getProjets() {
    let url = urlSrv + "getProjets.php";
    return this.http.get<Projet[]>(url);
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  getSessTravPourUnDev(idDev: number) {
    let url = urlSrv + "getSessTravPourUnDev.php";
    let params: HttpParams = new HttpParams(
      {
        fromObject:
        {
          idDev: idDev
        }
      }
    );
    return this.http.post<SessionTravail[]>(url, params);
  }
  //------------------------------------------------
  //
  //------------------------------------------------
  getSessTravs() {
    let url = urlSrv + "getSessTravs.php";
    return this.http.get<SessionTravail[]>(url);
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  getCommPourUnDev(idDev: number) {
    let url = urlSrv + "getCommPourUnDev.php";
    let params: HttpParams = new HttpParams(
      {
        fromObject:
        {
          idDev: idDev
        }
      }
    );
    return this.http.post<Commentaire[]>(url, params);

  }

  //------------------------------------------------
  //
  //------------------------------------------------
  getTaches(idProj: number) {
    let url = urlSrv + "getTaches.php?idProj=" + idProj;
    return this.http.get<Tache[]>(url);
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  postCommentaire(idSess: number, idDev: number, contenu: string) {
    let url = urlSrv + "postCommentaire.php";
    let params: HttpParams = new HttpParams(
      {
        fromObject:
        {
          idDev: idDev,
          idSession: idSess,
          contenu: contenu
        }
      }
    );
    return this.http.post<number>(url, params);

  }

  //------------------------------------------------
  //
  //------------------------------------------------
  postSessionTravail(idDev: number, idTache: number) {
    let url = urlSrv + "postSessionTravail.php";
    let params: HttpParams = new HttpParams(
      {
        fromObject:
        {
          idDev: idDev,
          idTache: idTache
        }
      }
    );
    return this.http.post<number>(url, params);
  }

  //------------------------------------------------
  //
  //------------------------------------------------
  putSessionTravail(idSessTrav: number) {
    let url = urlSrv + "putSessionTravail.php";
    let params: HttpParams = new HttpParams(
      {
        fromObject:
        {
          idSessTrav: idSessTrav
        }
      }
    );
    return this.http.post<number>(url, params);

  }
}
