import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Battle } from '../../Interfaces/battle';
import { BattleService } from '../services/battle.service';
import { Creature_Card } from '../../Interfaces/creature_card';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CdkDropList, MatCardModule, MatTooltipModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent { //this should probably be change to battle dialog or somehting like that
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);

  data = inject<Battle>(MAT_DIALOG_DATA);

  private battleService = inject(BattleService);

  readonly attacker : Creature_Card;
  readonly defender : Creature_Card;
  
  currentPlayerTurn = signal<Creature_Card>({
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
  });

  hand: any[] = []
  
  constructor()
  {
    this.attacker = this.battleService.getAttacker();
    this.defender = this.battleService.getDefender();
    this.hand = this.data.hand;

    this.currentPlayerTurn.set(
      this.attacker.Stats['speed'] > this.defender.Stats['speed'] ? this.attacker : this.defender 
    );    
  }

  ngOnInit() {
    this.dialogRef.updateSize('80%', '80%'); 
}


    determineBattleResults(userCard: Creature_Card, opposingCard: Creature_Card){
      if (userCard.Energy >  opposingCard.Energy){

        this.battleService.setWinner(userCard);
        this.battleService.setLoser(opposingCard);
      }
      else if (userCard.Energy < opposingCard.Energy){

        this.battleService.setWinner(opposingCard);
        this.battleService.setLoser(userCard);
      }
      else {
        // this.battleService.draw();
      }

      this.dialogRef.close({
        battleOccurred: true,
        loser: this.battleService.loser(),
        winner: this.battleService.winner()
      })
    }

    //elements : generic fire air earch water
    calculateDamage(user: Creature_Card, elementDamageArray: string[]) : number {
      let damage: number = 0;
        damage += parseInt(elementDamageArray[0]);

        if (user.Elements['fire']){
          damage += parseInt(elementDamageArray[1]);
        }
        if (user.Elements['air']){
          damage += parseInt(elementDamageArray[2]);
        }
        if (user.Elements['earth']){
          damage += parseInt(elementDamageArray[3]);
        }
        if (user.Elements['water']){
          damage += parseInt(elementDamageArray[4]);
        }

        return damage
    }

    // parameters
      // 0 - sort of check (check, challenge ...) and on what
      // 1 - criteria to meet
      // 2 - operator (AND, OR, XOR ....)
    CheckCriteria(criteria: string, user: Creature_Card) : boolean {
      let criteriaMet: boolean = false;

      let parameters: string[] = criteria.split('?').map(item => item.trim());
      let criteriaType: string[] = parameters[0].split(':').map(item => item.trim());

      let target: Creature_Card = this.getTarget(user, parameters[3])


      // flow = sort of check -> operator -> meet criteria -> set to true if it is met according to operator

      if (criteriaType[0] === 'Check'){

        if (criteriaType[1] === 'Elements'){

          let qualtifications: string[] = parameters[1].split(',').map(item => item.trim()); //have potentially multiple criteria to meet
          let overAllCheck: boolean;

          qualtifications.forEach(block => {
            let elementCheck: string[] = block.substring(1, block.length-1).split(':').map(item => item.trim());
            if (target.Elements[elementCheck[0]] === JSON.parse(elementCheck[1])){ //Do this better later
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
      }
      else if (criteriaType[0] === 'Challenge'){ //this should be moved to somewhere

        if (criteriaType[1] === 'Stats'){

          let qualtifications: string[] = parameters[1].split(',').map(item => item.trim()); //have potentially multiple criteria to meet
          let overAllCheck: boolean;

          qualtifications.forEach(block => {
            let statCheck: string[] = block.substring(1, block.length-1).split(':').map(item => item.trim());

            let challenge : number = user.Stats[statCheck[0]] - target.Stats[statCheck[0]];

            if(challenge >= parseInt(statCheck[1])){
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

      
      return criteriaMet;
    }

      // parameters
      // 0 - Whats affected and how much
      // 1 - who affected --done
      // 2 - operator (AND, OR, XOR ....)
    doEffect(additionalEffectString: string, user: Creature_Card) : void{
      
      let parameters: string[] = additionalEffectString.split('?').map(item => item.trim());
      let affected: Creature_Card = this.getTarget(user,parameters[2] )

      if(parameters[1] !== 'x'){ //do like I did with criteria
        // done something later, also maybe recursively go through effects? then don't need if check anymore
      }
      else {

        let effects: string[] = parameters[0].substring(1, parameters[0].length-1).split(':').map(item => item.trim());
        if (effects[1] !== 'x'){

          console.log('do effect on lists')
          switch (effects[0]) {
            case 'Stats':
              affected.Stats[effects[1]] += parseInt(effects[2])
              break;
            case 'Elements':
              affected.Elements[effects[1]] = effects[2] === 'x' ? false : true; 
              break;
            default:
              break;
          } 
        }
        else{

          console.log('do effects on props')
          switch (effects[0]) {
            case 'HP': //more to add as go along
              affected.Energy += parseInt(effects[2]);
              break;
            case 'Movement':
              affected.Statuses.push({
                'Movement' : effects[2]
              });
              break;
            default:
              break;
          }          
        }

      }
    }

    // useMugic(effect: string, user: Creature_Card, target : Creature_Card, cost: number) : void {

    //   let parameters = this.splitToString(effect, '?');        

    // }

    object2Array(obj: Object){
      return Object.entries(obj).map(([key, value]) => ({key, value}));
    }

    splitToString(value: string, splitOn: string) : string[] {
      return value.split(splitOn).map(item => item.trim());
    }

    getTarget(user : Creature_Card, target: string) : Creature_Card {

      switch (target) {
        case "Self":
          return user.Id === this.attacker.Id ? this.attacker : this.defender;
          break;
        
        case "Opposing":
          return user.Id === this.attacker.Id ? this.defender : this.attacker;
          break;

        case "Target" :
          return user.Id === this.attacker.Id ? this.defender : this.attacker;
          break;

        default:
          return user.Id === this.attacker.Id ? this.attacker : this.defender;
          break;
      }
    }

    use(value: string, user: Creature_Card){

      let abilityInformation = this.splitToString(value, '|');
      let metaInformation = this.splitToString(abilityInformation[0], '?');

      let target = this.getTarget(user, metaInformation[1]);

      // logic
      // mugic = check criteria ? do affect : prompt that you cant
      // strike = check elements => do dammage => check criteria ? do affect : don't do affect     

      if (metaInformation[0] === 'Mugic'){

        if (user.Mugic_Counter > 0 && user.Mugic_Counter >= parseInt(metaInformation[3])){ 
          
          if (user.Tribe === metaInformation[2] || metaInformation[2] === 'Generic'){ 
            
            if(this.CheckCriteria(abilityInformation[2], user)){ //maybe remove target

              // this.useMugic(abilityInformation[1], user, target, parseInt(metaInformation[3])); // is a seperate method even needed?
              user.Mugic_Counter -= parseInt(metaInformation[3])
              this.doEffect(abilityInformation[1], user);

            }

          }
        }

        if (user.Energy <= 0 || target.Energy <= 0){
          
          this.determineBattleResults(user, target)
        }
      }
      else if (metaInformation[0] === 'Strike'){

        let elementDamage = this.splitToString(abilityInformation[1], ':');
        target.Energy -= this.calculateDamage(user, elementDamage);

        if (abilityInformation[3] !== 'x'){

          if(this.CheckCriteria(metaInformation[4], user)){

            this.doEffect(abilityInformation[3], user)
          };

        }
        
        if (user.Energy <= 0 || target.Energy <= 0){//check if combat done
          this.determineBattleResults(user, target)
        }
      }

      this.currentPlayerTurn.set(target); //next players turn
    }
}
