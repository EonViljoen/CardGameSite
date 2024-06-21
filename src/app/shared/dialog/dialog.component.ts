import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { Battle } from '../../Interfaces/battle';
import { BattleService } from '../services/battle.service';
import { Card } from '../../Interfaces/card';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  data = inject<Battle>(MAT_DIALOG_DATA);
  private battleService = inject(BattleService);
  readonly attacker : Card;
  readonly defender : Card;
  // winner = signal;
  
  constructor()
  {
    this.attacker = this.battleService.getAttacker();
    this.defender = this.battleService.getDefender();
  }

  AttackWon() { 
    this.battleService.setWinner(this.battleService.getAttacker());
    this.battleService.setLoser(this.battleService.getDefender(), 'Defence');
    this.battleService.setSuccessfulAttack(true);
    }

  DefenceWon() {
    this.battleService.setWinner(this.battleService.getDefender());
    this.battleService.setLoser(this.battleService.getAttacker(), 'Attack');
    this.battleService.setSuccessfulAttack(false);
    }

}
