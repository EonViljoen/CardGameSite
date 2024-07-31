import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { BarComponent } from '../bar/bar.component';
import { Creature_Card } from '../../shared/Interfaces/creature_card';
import { CardService } from '../../shared/services/card.service';
import { BattleService } from '../../shared/services/battle.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-creature-profile',
  standalone: true,
  imports: [CommonModule, BarComponent, MatTooltipModule],
  templateUrl: './creature-profile.component.html',
  styleUrl: './creature-profile.component.scss'
})
export class CreatureProfileComponent {

  readonly cardService = inject(CardService);
  readonly battleService = inject(BattleService);

  @Input() creature: Creature_Card = {
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
    Player: 0,
    has_Moved: false
  }

  getTribeColour(tribe: string){
    return this.cardService.getTribeColour(tribe);
  }

  object2Array(obj: Object){
    return Object.entries(obj).map(([key, value]) => ({key, value}));
  }

  getCurrentPlayer() : number {
    return this.battleService.currentPlayer;
}
}
