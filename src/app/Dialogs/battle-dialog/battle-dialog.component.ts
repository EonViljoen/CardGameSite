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
import { TurnWindowComponent } from "../../Components/turn-window/turn-window.component";
import { BarComponent } from "../../Components/bar/bar.component";
import { CommonModule } from '@angular/common';
import { CreatureProfileComponent } from "../../Components/creature-profile/creature-profile.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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

  readonly targetDialog = inject(MatDialog);
  private cardService = inject(CardService);
  private battleService = inject(BattleService);

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

  //////////////////////Everything below should probably be moved to own service


  async determineBattleResults(userCard: Creature_Card){

    let opposingCard: any;
    
    await this.getTarget(userCard, 'Opposing').then(x => {
      opposingCard = x;
    });

    if (userCard.Energy <= 0 || opposingCard.Energy <= 0){

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
  }

  //elements : generic fire air earch water
  async doElementalDamage(userCard: Creature_Card, elementDamageArray: string[]) {

    let opposingCard: any;

    await this.getTarget(userCard, 'Opposing').then(x => {
      opposingCard = x
    });


    let damage: number = 0;
    damage += parseInt(elementDamageArray[0]);

    if (userCard.Elements['Fire']){
      damage += parseInt(elementDamageArray[1]);
    }
    if (userCard.Elements['Air']){
      damage += parseInt(elementDamageArray[2]);
    }
    if (userCard.Elements['Earth']){
      damage += parseInt(elementDamageArray[3]);
    }
    if (userCard.Elements['Water']){
      damage += parseInt(elementDamageArray[4]);
    }

    opposingCard.Energy -= damage;
  }

    // parameters
      // 0 - sort of check (check, challenge ...) and on what
      // 1 - criteria to meet
      // 2 - operator (AND, OR, XOR ....)
    async CheckCriteria(criteria: string, user: Creature_Card) : Promise<boolean> {
      let criteriaMet: boolean = false;

      let parameters: string[] = criteria.split('?').map(item => item.trim());
      let criteriaType: string[] = parameters[0].split(':').map(item => item.trim());

      let target: any;

      await this.getTarget(user, parameters[3]).then(x => {
        target = x
      });

      if (parameters[0] === 'x'){
        return true;
      }
      else{

        if (criteriaType[0] === 'Check'){

          if (criteriaType[1] === 'Elements'){
  
            let qualtifications: string[] = parameters[1].split(',').map(item => item.trim()); //have potentially multiple criteria to meet
            let overAllCheck: boolean;
  
            qualtifications.forEach(block => {
              let elementCheck: string[] = block.substring(1, block.length-1).split(':').map(item => item.trim());
  
              if (target.Elements[elementCheck[0]] === JSON.parse(elementCheck[1])){ 
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
  
              let challenge: number;
  
              challenge = user.Stats[statCheck[0]] - target.Stats[statCheck[0]];
  
  
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
    }

      // parameters
      // 0 - Whats affected and how much
      // 1 - who affected --done
      // 2 - operator (AND, OR, XOR ....)
    async doEffect(additionalEffectString: string, user: Creature_Card){
      
      let parameters: string[] = additionalEffectString.split('?').map(item => item.trim());
      let affected: any;

      await this.getTarget(user, parameters[2]).then(x => {
        affected = x
      });
      
      if(parameters[1] !== 'x'){
        // done something later, also maybe recursively go through effects? then don't need if check anymore
      }
      else {

        let effects: string[] = parameters[0].substring(1, parameters[0].length-1).split(':').map(item => item.trim());
        if (effects[1] !== 'x'){

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

          switch (effects[0]) {
            case 'HP': //more to add as go along
            affected.Energy += parseInt(effects[2]);
              break;

            case 'Stasis':
              affected.Statuses.push({
                'Stasis' : effects[2]
              });
              
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

    splitToString(value: string, splitOn: string) : string[] {
      return value.split(splitOn).map(item => item.trim());
    }



    async getTarget(user : Creature_Card, target: string) : Promise<Creature_Card>  {

      switch (target) {
        case "Self":
          return (user.Player === this.attacker.Player ? this.attacker : this.defender);
        
        case "Opposing":
          return (user.Player === this.attacker.Player ? this.defender : this.attacker);

        case "Target":
          return await this.chooseTarget();

        default:
          return (user.Player === this.attacker.Player ? this.attacker : this.defender);
      }
    }

    getUser(player: number) : Creature_Card {
      return player === this.attacker.Player ? this.attacker : this.defender; 
    }

    async chooseTarget(): Promise<Creature_Card>{

      const dialogRef =  this.targetDialog.open(TargetDialogComponent, {
        disableClose: true
      });

      return await dialogRef.afterClosed().toPromise();

    }

    useAbility(effect: string, playerNumber: number){
      this.useEffect(effect, playerNumber);
    }

    useCard(card: any, index: any, playerNumber: number){

      this.useEffect(card.Effect, playerNumber);
      this.cardService.discardCard(card, index);
      this.cardService.drawCard(1);

    }

    async useEffect(effect: string, playerNumber: number){

      let user = this.getUser(playerNumber);
      let abilityInformation = this.splitToString(effect, '|');
      let metaInformation = this.splitToString(abilityInformation[0], '?');

      console.log(metaInformation)

      if (metaInformation[0] === 'Mugic'){

        if (user.Mugic_Counter > 0 && user.Mugic_Counter >= parseInt(metaInformation[2])){ 
          
          if (user.Tribe === metaInformation[1] || metaInformation[1] === 'Generic'){ 
            
            if(await this.CheckCriteria(abilityInformation[2], user)){

              user.Mugic_Counter -= parseInt(metaInformation[2])
              this.doEffect(abilityInformation[1], user);
            }

          }
        }

        this.determineBattleResults(user);  
      }
      else if (metaInformation[0] === 'Strike'){

        let elementDamage = this.splitToString(abilityInformation[1], ':');
        this.doElementalDamage(user, elementDamage);



        if (abilityInformation[3] !== 'x'){

          if(await this.CheckCriteria(abilityInformation[3], user)){

            this.doEffect(abilityInformation[2], user)
          };

        }
        
        this.determineBattleResults(user)
      }

      this.transferTurn();        
  }
}
