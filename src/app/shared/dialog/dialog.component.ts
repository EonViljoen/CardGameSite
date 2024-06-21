import { ChangeDetectionStrategy, Component, Signal, inject, model, signal } from '@angular/core';
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
export class DialogComponent { //this should probably be change to battle dialog or somehting like that
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  data = inject<Battle>(MAT_DIALOG_DATA);
  private battleService = inject(BattleService);
  readonly attacker : Card;
  readonly defender : Card;
  currentPlayerTurn = signal<number>(1);
  // winner = signal;
  
  constructor()
  {
    this.attacker = this.battleService.getAttacker();
    this.defender = this.battleService.getDefender();
    
  }

  ngOnInit() {
    this.dialogRef.updateSize('80%', '80%');
}

  AttackWon() { 
    this.battleService.setWinner(this.battleService.getAttacker());
    this.battleService.setLoser(this.battleService.getDefender(), 'Defence');
    this.battleService.setSuccessfulAttack(true);
    this.dialogRef.close({
      battleOccurred: true
    })
    }

  DefenceWon() {
    this.battleService.setWinner(this.battleService.getDefender());
    this.battleService.setLoser(this.battleService.getAttacker(), 'Attack');
    this.battleService.setSuccessfulAttack(false);
    this.dialogRef.close({
      battleOccurred: true
    })
    }

}
