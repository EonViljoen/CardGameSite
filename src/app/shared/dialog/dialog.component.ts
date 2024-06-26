import { ChangeDetectionStrategy, Component, Signal, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { Battle } from '../../Interfaces/battle';
import { BattleService } from '../services/battle.service';
import { Card } from '../../Interfaces/card';
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray, transferArrayItem, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';



@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CdkDropList, MatCardModule],
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
  hand: any[] = []
  
  constructor()
  {
    this.attacker = this.battleService.getAttacker();
    this.defender = this.battleService.getDefender();
    this.hand = this.data.hand;

    this.currentPlayerTurn.set(
      this.attacker.stats['speed'] > this.defender.stats['speed'] ? this.attacker.player : this.defender.player 
    );    
  }

  ngOnInit() {
    this.dialogRef.updateSize('80%', '80%'); 
}


    BattleResults(winner: Card, loser: Card){
      this.battleService.setWinner(winner);
      this.battleService.setLoser(loser);

      this.dialogRef.close({
        battleOccurred: true,
        loser: loser,
        winner: winner
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

    calculateDamage(user: Card, elementDamageArray: string[]) : number {
      let damage: number = 0;
        damage += parseInt(elementDamageArray[0]);

        if (user.elements['fire']){
          damage += parseInt(elementDamageArray[1]);
        }
        if (user.elements['air']){
          damage += parseInt(elementDamageArray[2]);
        }
        if (user.elements['earth']){
          damage += parseInt(elementDamageArray[3]);
        }
        if (user.elements['water']){
          damage += parseInt(elementDamageArray[4]);
        }

        return damage
    }

    CheckCriteria(criteriaString: string, user: Card, target: Card) : boolean {
      let criteriaMet: boolean = false;

      let parameters: string[] = criteriaString.split('?').map(item => item.trim());
      let check: string[] = parameters[0].split(':').map(item => item.trim());

      // flow = sort of check -> operator -> meet criteria -> set to true if it is met according to operator

      if (check[0] === 'Check'){
        if (check[1] === 'Elements'){

          let statChecks: string[] = parameters[1].split(',').map(item => item.trim()); //have potentially multiple criteria to meet
          let overAllCheck: boolean;

          let checker: Card = parameters[3] === 'Self' ? user : target;

          statChecks.forEach(stat2Check => {
            let meet: string[] = stat2Check.substring(1, stat2Check.length-1).split(':').map(item => item.trim());
            console.log('here?')
            if (checker.elements[meet[0]] === JSON.parse(meet[1])){ //Do this better later
              console.log('criteria met')
              criteriaMet = true;
            }

            if (parameters[2] !== 'x'){
              if (!overAllCheck){
                console.log('in here')
                overAllCheck = criteriaMet;
              }
              else{
                console.log('making sure its true')
                if (parameters[2] === 'AND'){

                  overAllCheck = overAllCheck && criteriaMet;
                }
                else if (parameters[2] === 'OR'){

                  overAllCheck = overAllCheck || criteriaMet;
                }
              }
            }
          })
        }
      }
      else if (check[0] === 'Challenge'){ //this should be moved to somewhere

        if (check[1] === 'Stats'){

          let statChecks: string[] = parameters[1].split(',').map(item => item.trim()); //have potentially multiple criteria to meet
          let overAllCheck: boolean;

          statChecks.forEach(stat2Check => {
            let meet: string[] = stat2Check.substring(1, stat2Check.length-1).split(':').map(item => item.trim());

            let challenge : number = user.stats[meet[0]] - target.stats[meet[0]];

            if(challenge >= parseInt(meet[1])){
              criteriaMet = true;
            }

            if (parameters[2] !== 'x'){
              if (!overAllCheck){
                
                overAllCheck = criteriaMet;
              }
              else{

                if (parameters[2] === 'AND'){

                  overAllCheck = overAllCheck && criteriaMet;
                }
                else if (parameters[2] === 'OR'){

                  overAllCheck = overAllCheck || criteriaMet;
                }
              }
            }
          })
        }
        // else if (check[1] === 'Elements'){ //don't know if this is really gonna happen but keeping it here
          
        // }
      }

      // parameters
      // 0 - sort of check (check, challenge ...) and on what
      // 1 - criteria to meet
      // 2 - operator (AND, OR, XOR ....)

// Check : Elements ? [Fire : x]
// Challenge : Stats ? [Courage : 15]'

      return criteriaMet;
    }

    object2Array(obj: Object){
      return Object.entries(obj).map(([key, value]) => ({key, value}));
    }

    useAbility(value: string, player: Card){ //offboard most of this to service, also use this as blueprint for card effects maybe
      // some funky shit about to happen below

      let user = player.id === this.attacker.id ? this.attacker : this.defender
      let opposing = player.id === this.attacker.id ? this.defender : this.attacker

      let ability: string[] = value.split('|').map(item => item.trim());
      let action : string [] = ability[0].split('?').map(item => item.trim());
      let target = ability[1] === 'Self' ? user : opposing;

      // mugic 
      // 0 - action
      // 1 - target
      // 2 - affecting
      // 3 - amount 
      // 4 - criteria

      // strike 
      // 0 - action
      // 1 - target
      // 2 - elemental damage
      // 3 - affecting 
      // 4 - criteria

      // logic
      // mugic = check criteria ? do affect : prompt that you cant
      // strike = check elements => do dammage => check criteria ? do affect : don't do affect

      // mayber move target to action section

      // 0: ' Mugic ? Overworld ? 1 | Self | HP | +15 | x', //done, make HP dynamic somehow  -- vidav heal
      // 1: ' Mugic ? Generic ? 1 | Target | HP | +15 | Check : Elements ? [Earth : x] , [Water : x] ? OR', -- geo flurish
      // 2: ' Mugic ? Overworld ? 1 | Target | Movement | Stop | x', -- statis
      // 3: ' Mugic ? Underworld ? 1 | Target | HP | -20 | x', //done, make HP dynamic somehow -- causalty
      // 4: ' Strike | Target | 5 : 5: 0: 0: 0 | Stats ? [Wisdom : -25] ? Opposing | Check : Elements ? [Fire : x]', -- ember swarm
      // 5: ' Strike | Target | 0 : 10: 0: 0: 0 | Elements ? [Fire : Lose] ? Self | Check : Elements ? [Fire : x]', -- incinerate
      // 6: ' Strike | Target | 0 : 0: 5: 5: 0 | x | x', // done -- pebblestorm
      // 7: ' Strike | Target | 5 : 5: 0: 0: 0 | HP ? -10 ? Opposing | Challenge : Stats ? [Courage : 15]', -- rustoxic

      //elements : generic fire air earch water

      if (action[0] === 'Mugic'){
        if (user.mugic_counter > 0 && user.mugic_counter >= parseInt(action[2])){
          if (player.tribe === (action[1] || 'Generic')){

            if (ability[2] === 'HP'){

              target.hp += parseInt(ability[3]);
              user.mugic_counter -= parseInt(action[2]);
            }
          }
        }

        if (target.hp <= 0){
          this.BattleResults(user, target)
        }
      }
      else if (action[0] === 'Strike'){

        let elementDamage : string[] = ability[2].split(':').map(item => item.trim()); 
        let criteriaMet : boolean = false; 
        target.hp -= this.calculateDamage(user, elementDamage);

        if (ability[4] !== 'x'){
          criteriaMet = this.CheckCriteria(ability[4], user, opposing);
        }

        if (criteriaMet){
          // do ability[3]
        }
        
        if (target.hp <= 0){
          this.BattleResults(user, target)
        }
      }

      this.currentPlayerTurn.set(opposing.player)      
    }
}
