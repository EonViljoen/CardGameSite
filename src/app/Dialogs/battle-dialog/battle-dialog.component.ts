import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Battle } from '../../shared/Interfaces/battle';
import { BattleService } from '../../shared/services/battle.service';
import { Creature_Card } from '../../shared/Interfaces/creature_card';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CardService } from '../../shared/services/card.service';
import { TargetDialogComponent } from '../target-dialog/target-dialog.component';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-battle-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CdkDropList, MatCardModule, MatTooltipModule],
  templateUrl: './battle-dialog.component.html',
  styleUrl: './battle-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattleDialogComponent { //this should probably be change to battle dialog or somehting like that
  
  readonly battleDialog = inject(MatDialogRef<BattleDialogComponent>);
  gameBoardData = inject<Battle>(MAT_DIALOG_DATA);

  readonly targetDialog = inject(MatDialog);
  private cardService = inject(CardService);
  private battleService = inject(BattleService);

  attacker : Creature_Card = this.battleService.getAttacker();
  defender : Creature_Card = this.battleService.getDefender();
  
  hand: any[] = []

  ngOnInit() {
    this.battleDialog.updateSize('80%', '80%'); 

    this.battleService.setCurrentPlayer(this.attacker.Player);
  }

  getHand(): any[]{
    return this.cardService.getHand();
  }

  //////////////////////Everything below should probably be moved to own service


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

    this.battleDialog.close({
      battleOccurred: true,
      loser: this.battleService.loser(),
      winner: this.battleService.winner()
    })
  }

  //elements : generic fire air earch water
  calculateDamage(user: Creature_Card, elementDamageArray: string[]) : number {
    let damage: number = 0;
      damage += parseInt(elementDamageArray[0]);

      if (user.Elements['Fire']){
        damage += parseInt(elementDamageArray[1]);
      }
      if (user.Elements['Air']){
        damage += parseInt(elementDamageArray[2]);
      }
      if (user.Elements['Earth']){
        damage += parseInt(elementDamageArray[3]);
      }
      if (user.Elements['Water']){
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

      
      let target = this.getTarget(user, parameters[3]);

      if (parameters[0] === 'x'){
        return true;
      }

      if (criteriaType[0] === 'Check'){

        if (criteriaType[1] === 'Elements'){

          let qualtifications: string[] = parameters[1].split(',').map(item => item.trim()); //have potentially multiple criteria to meet
          let overAllCheck: boolean;

          qualtifications.forEach(block => {
            let elementCheck: string[] = block.substring(1, block.length-1).split(':').map(item => item.trim());

            target.subscribe(x => { //Is this right? Should I unsubscribe?
              if (x.Elements[elementCheck[0]] === JSON.parse(elementCheck[1])){ 
                criteriaMet = true;
              }
            })

            // if (target.Elements[elementCheck[0]] === JSON.parse(elementCheck[1])){ //Do this better later
            //   criteriaMet = true;
            // }

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

            let challenge: number;

            target.subscribe(x => { //Is this right? Should I unsubscribe?
              challenge = user.Stats[statCheck[0]] - x.Stats[statCheck[0]];

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


            // let challenge : number = user.Stats[statCheck[0]] - target.Stats[statCheck[0]];

            
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
      let affected = this.getTarget(user,parameters[2]);
      
      if(parameters[1] !== 'x'){ //do like I did with criteria
        // done something later, also maybe recursively go through effects? then don't need if check anymore
      }
      else {

        let effects: string[] = parameters[0].substring(1, parameters[0].length-1).split(':').map(item => item.trim());
        if (effects[1] !== 'x'){

          switch (effects[0]) {
            case 'Stats':
              affected.subscribe(x => {
                x.Stats[effects[1]] += parseInt(effects[2])
              })
              break;

            case 'Elements':
            affected.subscribe(x => {
              x.Elements[effects[1]] = effects[2] === 'x' ? false : true; 
            })
              break;
              
            default:
              break;
          } 
        }
        else{

          switch (effects[0]) {
            case 'HP': //more to add as go along
            affected.subscribe(x => {
              x.Energy += parseInt(effects[2]);
            })
              break;

            case 'Movement':
              affected.subscribe(x => {
                x.Statuses.push({
                  'Movement' : effects[2]
                });
              })
              
              break;

            default:
              break;
          }          
        }

      }
    }

    transferTurn(): void {

        this.battleService.getCurrentPlayer() === this.attacker.Player 
        ? this.battleService.setCurrentPlayer(this.defender.Player) 
        : this.battleService.setCurrentPlayer(this.attacker.Player)
    }

    object2Array(obj: Object){
      return Object.entries(obj).map(([key, value]) => ({key, value}));
    }

    splitToString(value: string, splitOn: string) : string[] {
      return value.split(splitOn).map(item => item.trim());
    }

    getCurrentPlayer() : number {
      return this.battleService.currentPlayer;
  }

    getTarget(user : Creature_Card, target: string) : Observable<Creature_Card>{

      switch (target) {
        case "Self":
          console.log('self');
          return of (user.Player === this.attacker.Player ? this.attacker : this.defender);
        
        case "Opposing":
          console.log('opposing');
          return of (user.Player === this.attacker.Player ? this.defender : this.attacker);

        case "Target" :
          console.log('target');
          // return user.Player === this.attacker.Player ? this.defender : this.attacker;
          return this.chooseTarget();

        default:
          return of (user.Player === this.attacker.Player ? this.attacker : this.defender);
      }
    }

    getUser(player: number) : Creature_Card {
      return player === this.attacker.Player ? this.attacker : this.defender; 
    }

    chooseTarget(): Observable<Creature_Card>{

      let target: Creature_Card = {
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
      }

      const dialogRef = this.targetDialog.open(TargetDialogComponent, {
      });

      return dialogRef.afterClosed().pipe(
        map((result: any) => result.target as Creature_Card)
      )

      // return target;
    }

    useAbility(effect: string, playerNumber: number){
      this.useEffect(effect, playerNumber);
    }

    useCard(card: any, index: any, playerNumber: number){
      this.useEffect(card.Effect, playerNumber);
      this.cardService.discardCard(card, index);
      this.cardService.drawCard(1);

    }

    useEffect(effect: string, playerNumber: number){

      let user = this.getUser(playerNumber);
      let abilityInformation = this.splitToString(effect, '|');
      let metaInformation = this.splitToString(abilityInformation[0], '?');

      let target = this.getTarget(user, metaInformation[1]);

      if (metaInformation[0] === 'Mugic'){

        if (user.Mugic_Counter > 0 && user.Mugic_Counter >= parseInt(metaInformation[3])){ 
          
          if (user.Tribe === metaInformation[2] || metaInformation[2] === 'Generic'){ 
            
            if(this.CheckCriteria(abilityInformation[2], user)){

              user.Mugic_Counter -= parseInt(metaInformation[3])
              this.doEffect(abilityInformation[1], user);
            }

          }
        }

        target.subscribe(x => {
          if (user.Energy <= 0 || x.Energy <= 0){
            this.determineBattleResults(user, x)
          }
        })        
      }
      else if (metaInformation[0] === 'Strike'){

        target.subscribe(x => {
          let elementDamage = this.splitToString(abilityInformation[1], ':');
          x.Energy -= this.calculateDamage(user, elementDamage);
        }) 


        if (abilityInformation[3] !== 'x'){

          if(this.CheckCriteria(abilityInformation[3], user)){

            this.doEffect(abilityInformation[2], user)
          };

        }
        

        target.subscribe(x => {
          if (user.Energy <= 0 || x.Energy <= 0){
            this.determineBattleResults(user, x)
          }
        }) 
      }

      this.transferTurn();        
  }
}
