import {inject, Injectable, signal} from '@angular/core';
import { Creature_Card } from '../Interfaces/creature_card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BattleDialogComponent } from '../../Dialogs/battle-dialog/battle-dialog.component';
import { TargetDialogComponent } from '../../Dialogs/target-dialog/target-dialog.component';
import { NotificationService } from './notification.service';
import { FieldService } from './field.service';

@Injectable({
  providedIn: 'root',
})

export class BattleService {

    readonly targetDialog = inject(MatDialog);

    readonly notificationService = inject(NotificationService);
    readonly fieldService = inject(FieldService);

    attacker: Creature_Card = {
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
    };

    defender: Creature_Card = {
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
    };

    combatWinner: Creature_Card = {
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
    };

    combatLoser: Creature_Card = {
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
    };

    currentPlayer: number = 0;
    movingPlayer: number = 0;

    successfulAttack: boolean = false;
    combatFinished: boolean = false;

    setCurrentPlayer() {
        if (this.currentPlayer === 0){
            this.currentPlayer = 1;
        }
        else{
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;

            this.notificationService.showNotification(
                'Player ' + this.currentPlayer + "'s Turn",
                true,
                ''
            );
        }

        return this.currentPlayer;
    }

    getCurrentPlayer() : number {
        return this.currentPlayer;
    }

    async setMovingPlayer(field: any): Promise<number>{ //this and one below should be moved to own service and done better somehow
        return new Promise((resolve, reject) => {
            try {

                if (this.movingPlayer === 0) {

                    this.movingPlayer = 1;
                    resolve(this.movingPlayer);
                } else {

                    this.fieldService.hasAllFinishedMoving(this.movingPlayer).then(result => {
                        if (result){
                            this.fieldService.resetCreatureMovement(this.movingPlayer, field);
                            this.movingPlayer = this.movingPlayer === 1 ? 2 : 1;

                            console.log('moving player')
                            console.log(this.movingPlayer)
        
                            resolve(this.movingPlayer);
                        }
                        else{

                            resolve(this.movingPlayer)
                        }
                    })

                    
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    
    getMovingPlayer(): number{
     return this.movingPlayer;
    }

    setAttacker(attacker: Creature_Card){ //better way of setting this?
        this.attacker = attacker;
    }

    setDefender(defender: Creature_Card){
        this.defender = defender;
    }

    getAttacker(){
        return this.attacker;
    }

    getDefender(){
        return this.defender;
    }

    getCombatFinished(): Promise<Boolean>{
        return new Promise<Boolean>((value) => {
            value(this.combatFinished)
        });
    }

    setSuccessfulAttack(){
        this.successfulAttack = true;
        this.combatFinished = true;
    }

    setUnsuccessfulAttack(){
        this.successfulAttack = false;
        this.combatFinished = true;
    }

    reset(){

        this.attacker ={
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
        };

        this.defender ={
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
        };

        this.combatWinner = {
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
        }; 

        this.combatLoser ={
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
        };
    }

    async determineBattleResults(userCard: Creature_Card, battleDialogRef : any){

        let opposingCard: any;
        
        await this.getTarget(userCard, 'Opposing').then(x => {
          opposingCard = x;
        });
    
        if (userCard.Energy <= 0 || opposingCard.Energy <= 0){
    
            // this.combatFinished = true;

            if (userCard.Energy >  opposingCard.Energy){

                this.setSuccessfulAttack();
                this.combatWinner = userCard;
                this.combatLoser = opposingCard;
                // this.setWinner(userCard);
                // this.setLoser(opposingCard);

                this.notificationService.showNotification(
                    userCard.Name + ' defeated ' + opposingCard.Name,
                    true,
                    'Results'
                );

            }
            else if (userCard.Energy < opposingCard.Energy){
        
                this.setUnsuccessfulAttack();
                this.combatWinner = opposingCard;
                this.combatLoser = userCard;
                // this.setWinner(opposingCard);
                // this.setLoser(userCard);

                this.notificationService.showNotification(
                    opposingCard.Name + ' defeated ' + userCard.Name,
                    true,
                    'Results'
                );
            }
            else {
            // this.battleService.draw();

            this.notificationService.showNotification(
                'Draw',
                true,
                'Results'
            )

            }
    
            battleDialogRef.close({
                battleOccurred: true,
                loser: this.combatLoser,
                winner: this.combatWinner
                })
          
    }            
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

    async chooseTarget(): Promise<Creature_Card>{

    const dialogRef =  this.targetDialog.open(TargetDialogComponent, {
        disableClose: true,
    });

    return await dialogRef.afterClosed().toPromise();

    }
}