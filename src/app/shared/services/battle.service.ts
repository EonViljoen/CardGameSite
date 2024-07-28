import {inject, Injectable, signal} from '@angular/core';
import { Creature_Card } from '../Interfaces/creature_card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BattleDialogComponent } from '../../Dialogs/battle-dialog/battle-dialog.component';
import { TargetDialogComponent } from '../../Dialogs/target-dialog/target-dialog.component';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})

export class BattleService {

    readonly targetDialog = inject(MatDialog);

    readonly notificationService = inject(NotificationService)

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
        Player: 0
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
        Player: 0
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
        Player: 0
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
        Player: 0
    };

    currentPlayer: number = 0;
    movingPlayer: number = 0;

    successfulAttack: boolean = false;
    combatFinished: boolean = false;

    setCurrentPlayer() {
        if (this.currentPlayer === 0){
            this.currentPlayer = 1;
            return this.currentPlayer;
        }
        else{
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            return this.currentPlayer;
        }  
    }

    getCurrentPlayer() : number {
        return this.currentPlayer;
    }

    setMovingPlayer(): number { //this and one below should be moved to own service and done better somehow
        if (this.movingPlayer === 0){
            this.movingPlayer = 1;
            return this.movingPlayer;
        }
        else{
            this.movingPlayer = this.movingPlayer === 1 ? 2 : 1;
            return this.movingPlayer;
        }   
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

    getCombateFinished(){
        return this.combatFinished;
    }

    setSuccessfulAttack(){
        this.successfulAttack = true;
        this.combatFinished = true;
    }

    setUnsuccessfulAttack(){
        this.successfulAttack = false;
        this.combatFinished = true;
    }

    // setBattleAfterMath(previousState: Creature_Card[] | any): Creature_Card[] {
    //     previousState.at(0).Abilities = this.winner().Abilities;
    //     previousState.at(0).Elements = this.winner().Elements;
    //     previousState.at(0).Energy = this.winner().Energy;
    //     previousState.at(0).Max_Energy = this.winner().Max_Energy;
    //     previousState.at(0).Mugic_Counter = this.winner().Mugic_Counter;
    //     previousState.at(0).Player = this.winner().Player;
    //     previousState.at(0).Stats = this.winner().Stats;

    //     return previousState.at(0);
    // }

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
            Player: 0
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
            Player: 0
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
            Player: 0
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
            Player: 0
        };
    }

    async determineBattleResults(userCard: Creature_Card, battleDialogRef : any){

        let opposingCard: any;
        
        await this.getTarget(userCard, 'Opposing').then(x => {
          opposingCard = x;
        });
    
        if (userCard.Energy <= 0 || opposingCard.Energy <= 0){
    
            this.combatFinished = true;

            if (userCard.Energy >  opposingCard.Energy){

            this.combatWinner = userCard;
            this.combatLoser = opposingCard;
            // this.setWinner(userCard);
            // this.setLoser(opposingCard);

            this.notificationService.showNotification(
                userCard.Name + ' defeated ' + opposingCard.Name,
                true
            );

            }
            else if (userCard.Energy < opposingCard.Energy){
        
            this.combatWinner = opposingCard;
            this.combatLoser = userCard;
            // this.setWinner(opposingCard);
            // this.setLoser(userCard);

            this.notificationService.showNotification(
                opposingCard.Name + ' defeated ' + userCard.Name,
                true
            );
            }
            else {
            // this.battleService.draw();

            this.notificationService.showNotification(
                'Draw',
                true
            )

            }
    
            battleDialogRef.close({
                battleOccurred: true,
                loser: this.combatLoser,
                winner: this.combatWinner
                })
          
    }            
}


    transferTurn() {

    this.getCurrentPlayer() === this.attacker.Player 
    ? this.setCurrentPlayer() 
    : this.setCurrentPlayer()

    this.notificationService.showNotification(
        'Player ' + this.getCurrentPlayer() + "'s Turn",
        true
        );
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