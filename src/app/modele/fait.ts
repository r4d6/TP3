import { dateISO, tr } from "../util";
import { Commentaire } from "./commentaire";
import { SessionTravail } from "./sessionTravail";

export class Fait{
    idTache=0;
    numTache="";
    date="";
    heure="";
    type="";
    contenu="";

    constructor(st:SessionTravail, traiteDebut=true, comm:Commentaire=new Commentaire())
    {
        this.idTache = st.idTache;
        this.numTache = st.numTache;
        
        let horodate = "";
        
        if (comm.contenu.length == 0)
        {

           if (traiteDebut)
           {
              horodate = dateISO(st.debut);
              this.type = "debut";
           }
           else
           {
             horodate = dateISO(st.fin);
             this.type="fin";
           }
        }
        else
        {
            this.contenu = comm.contenu;
            horodate =  dateISO(comm.horodateur);
        }

        tr(horodate);
        let tabInfoDate = horodate.split(" ");
        this.date = tabInfoDate[0];
        this.heure = tabInfoDate[1];
    }
}