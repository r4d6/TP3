import { Component } from '@angular/core';
import { Developpeur } from '../modele/developpeur';
import { tr } from '../util';
import { CommonModule } from '@angular/common';

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

  onDemarrerSessTrav(dev:Developpeur)
  {
    this.visible=true;
    tr("Démarrage");
  }
}
