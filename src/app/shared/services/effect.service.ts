import { inject, Injectable } from '@angular/core';
import { Creature_Card } from '../Interfaces/creature_card';
import { BattleService } from './battle.service';
import { CardService } from './card.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class EffectService {

  readonly battleService = inject(BattleService);
  readonly cardService = inject(CardService);
  readonly notificationService = inject(NotificationService)


  // attacker : Creature_Card = this.battleService.getAttacker();
  // defender : Creature_Card = this.battleService.getDefender();

  constructor() { }

  //elements : generic fire air earch water
  async doElementalDamage(userCard: Creature_Card, elementDamageArray: string[]) {

    let opposingCard: any;

    await this.battleService.getTarget(userCard, 'Opposing').then(x => {
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

      await this.battleService.getTarget(user, parameters[3]).then(x => {
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

      await this.battleService.getTarget(user, parameters[2]).then(x => {
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

    splitToString(value: string, splitOn: string) : string[] {
      return value.split(splitOn).map(item => item.trim());
    }

    getUser(player: number) : Creature_Card {

      let attacker = this.battleService.getAttacker();
      let defender = this.battleService.getDefender();

      return player === attacker.Player ? attacker : defender; 
    }

    async useEffect(effect: string, playerNumber: number, battleDialog: any){

      let user = this.getUser(playerNumber);
      let abilityInformation = this.splitToString(effect, '|');
      let metaInformation = this.splitToString(abilityInformation[0], '?');

      console.log(metaInformation)

      if (metaInformation[0] === 'Mugic'){

        if (user.Mugic_Counter > 0 && user.Mugic_Counter >= parseInt(metaInformation[2])){ 
          
          if (user.Tribe === metaInformation[1] || metaInformation[1] === 'Generic'){ 
            
            if(await this.CheckCriteria(abilityInformation[1], user)){

              // this.notificationService.showNotification('Criteria Met', true, 'Criteria')

              user.Mugic_Counter -= parseInt(metaInformation[2])
              this.doEffect(abilityInformation[2], user);
            }

          }
        }

        await this.battleService.determineBattleResults(user, battleDialog);  
      }
      else if (metaInformation[0] === 'Strike'){

        let elementDamage = this.splitToString(abilityInformation[1], ':');
        this.doElementalDamage(user, elementDamage);

        if (abilityInformation[2] !== 'x'){

          if(await this.CheckCriteria(abilityInformation[2], user)){

            // this.notificationService.showNotification('Criteria Met', true, 'Criteria')

            this.doEffect(abilityInformation[3], user)
          };
        }
        
        await this.battleService.determineBattleResults(user, battleDialog)
      }

      // this.battleService.transferTurn();        
  }
}
