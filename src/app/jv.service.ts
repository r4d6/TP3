//-----------------------------------
  //   Fichier : 
  //   Par:      Alain Martel
  //   Date :    2024-10-21
  //-----------------------------------

 import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Tache } from './modele/tache';
import { Developpeur } from './modele/developpeur';
import { Projet } from './modele/projet';
import { urlSrv } from './util';
import { SessionTravail } from './modele/sessionTravail';

@Injectable({
  providedIn: 'root'
})
export class JvService {

  constructor(private http:HttpClient) { }

  
  getConnexion(pMat:string, pMdp:string)
  {
    let url = urlSrv + "getConnexion.php";
    let params:HttpParams = new HttpParams(
      {
         fromObject :
         {
           mat:pMat,
           mdp:pMdp
         }
      }
    );
    return this.http.post<Developpeur>(url, params);
  }

  getProjets()
  {
    let url = urlSrv + "getProjets.php?mat";
    return this.http.get<Projet[]>(url);
  }

  getSessTravPourUnDev(idDev:number)
  {
    let url = urlSrv + "getSessTravPourUnDev.php";
    let params:HttpParams = new HttpParams(
      {
         fromObject :
         {
           idDev :idDev
         }
      }
    );
    return this.http.post<SessionTravail[]>(url, params);
  }
  
  getTaches(idProj:number)
  {
    let url = urlSrv + "getTaches.php?idProj=" + idProj;
    return this.http.get<Tache[]>(url);
  }

  postSessionTravail(idDev:number, idTache:number)
  {
    let url = urlSrv + "postSessionTravail.php";
    let params:HttpParams = new HttpParams(
      {
         fromObject :
         {
           idDev:idDev,
           idTache:idTache
         }
      }
    );
    return this.http.post<number>(url, params);
  }
}
