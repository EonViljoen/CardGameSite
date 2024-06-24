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

  // AttackWon() { 
  //     this.battleService.setWinner(this.battleService.getAttacker());
  //     this.battleService.setLoser(this.battleService.getDefender());
  //     this.battleService.setSuccessfulAttack(true);
  //     this.dialogRef.close({
  //       battleOccurred: true
  //     })
  //   }

  // DefenceWon() {
  //     this.battleService.setWinner(this.battleService.getDefender());
  //     this.battleService.setLoser(this.battleService.getAttacker());
  //     this.battleService.setSuccessfulAttack(false);
  //     this.dialogRef.close({
  //       battleOccurred: true
  //     })
  //   }

    BattleResults(winner: Card, loser: Card){
      // let winner = player.id === this.attacker.id ? this.attacker : this.defender
      // let loser = player.id === this.attacker.id ? this.attacker : this.defender

      this.battleService.setWinner(winner);
      this.battleService.setLoser(loser);

      this.dialogRef.close({
        battleOccurred: true,
        loser: loser
      })
    }

    CalculateHeal(user: Card){
      let currentHealth = user.hp;

      if (user.max_hp - currentHealth > 50){
        user.hp += 50
      }
      else {
        user.hp = user.max_hp
      }
    }

    object2Array(obj: Object){
      return Object.entries(obj).map(([key, value]) => ({key, value}));
    }

    useAbility(value: string, player: Card){ //offboard most of this to service, also use this as blueprint for card effects maybe
      let ability: string[] = value.split('|').map(item => item.trim());

      let user = player.id === this.attacker.id ? this.attacker : this.defender
      let target = player.id === this.attacker.id ? this.defender : this.attacker

      if (ability[0] === 'Attack'){

        target.hp -= +ability[1];

        if (target.hp <= 0){
          this.BattleResults(user, target)
        }
      }
      else if (ability[0] === 'Mugic Heal'){
        if (user.mugic_counter > 0){
          user.hp += 50;

          this.CalculateHeal(user);
          user.mugic_counter -= 1;
        }
      }

      // ability 
      // 0 - action
      // 1 - quantity
      // 2 - cost
    }
}
