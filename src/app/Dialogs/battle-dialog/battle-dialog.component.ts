import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Battle } from '../../shared/Interfaces/battle';
import { BattleService } from '../../shared/services/battle.service';
import { Creature_Card } from '../../shared/Interfaces/creature_card';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardService } from '../../shared/services/card.service';
import { TurnWindowComponent } from "../../Components/turn-window/turn-window.component";
import { BarComponent } from "../../Components/bar/bar.component";
import { CommonModule } from '@angular/common';
import { CreatureProfileComponent } from "../../Components/creature-profile/creature-profile.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectService } from '../../shared/services/effect.service';

@Component({
  selector: 'app-battle-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CdkDropList,
    MatCardModule, MatTooltipModule, TurnWindowComponent, BarComponent,
    CommonModule, CreatureProfileComponent,
    FontAwesomeModule],
  templateUrl: './battle-dialog.component.html',
  styleUrl: './battle-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattleDialogComponent {
  
  readonly battleDialog = inject(MatDialogRef<BattleDialogComponent>);
  gameBoardData = inject<Battle>(MAT_DIALOG_DATA);

  // readonly targetDialog = inject(MatDialog);
  private cardService = inject(CardService);
  private battleService = inject(BattleService);
  private effectService = inject(EffectService)

  attacker : Creature_Card = this.battleService.getAttacker();
  defender : Creature_Card = this.battleService.getDefender();
  
  hand: any[] = []

  ngOnInit() {
    // this.battleDialog.updateSize('80%', '80%'); 

    this.battleService.setCurrentPlayer(this.attacker.Player);
  }

  getHand(): any[]{
    return this.cardService.getHand();
  }

  useCard(card: any, index: any, playerNumber: number){

  this.effectService.useEffect(card.Effect, playerNumber, this.battleDialog);
  this.cardService.discardCard(card, index);
  this.cardService.drawCard(1);
  }

  useAbility(effect: string, playerNumber: number){
    this.effectService.useEffect(effect, playerNumber, this.battleDialog);
  }

  retreat(attacker: Creature_Card, defender: Creature_Card){
    this.battleDialog.close()
    this.battleService.transferTurn();
  }

  // combatFinished(){
  //   if (this.battleService.getCombateFinished()){
  //     this.battleDialog.close({
  //       battleOccurred: true,
  //       loser: this.battleService.loser(),
  //       winner: this.battleService.winner()
  //     })
  //   }
  // }
}
