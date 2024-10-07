import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tache } from './modele/tache';

@Injectable({
  providedIn: 'root'
})
export class JvService {

  constructor(private http:HttpClient) { }

  
  getConnexion()
  {
    let url = "http://localhost/jv24-srv/getConnexion.php?mat=1111111&mdp=11";
  }
  
  getTaches()
  {
    let url = "http://localhost/jv24-srv/getTaches.php";
    return this.http.get<Tache[]>(url);
  }
}
