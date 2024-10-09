import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Tache } from './modele/tache';
import { Developpeur } from './modele/developpeur';
import { Projet } from './modele/projet';

@Injectable({
  providedIn: 'root'
})
export class JvService {

  constructor(private http:HttpClient) { }

  
  getConnexion(pMat:string, pMdp:string)
  {
    let url = "http://localhost/jv24-srv/getConnexion.php";
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
    let url = "http://localhost/jv24-srv/getProjets.php?mat";
    return this.http.get<Projet[]>(url);
   }
  
  getTaches(idProj:number)
  {
    let url = "http://localhost/jv24-srv/getTaches.php?idProj=" + idProj;
    return this.http.get<Tache[]>(url);
  }
}
