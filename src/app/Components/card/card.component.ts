import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Creature_Card } from '../../shared/Interfaces/creature_card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, CdkDrag],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() Card: Creature_Card = {
    Id: '',
    Name: '',
    Picture: '',
    Card: '',
    Energy: 0,
    Max_Energy: 0,
    Mugic_Counter: 0,
    Tribe: '',
    Class: '',
    Stats: {},
    Elements: {},
    Abilities: {},
    Statuses: [{}],
    Player: 0
  };
  @Input() Moveable: boolean= false;

  isImmobile(): boolean {

    const status = this.Card.Statuses.find(x => x["Immobile"]);

    if (status){
      return true
    }
    else{
      return false;
    }
  }
}
