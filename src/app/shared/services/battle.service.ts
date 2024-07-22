import {Injectable, signal} from '@angular/core';
import { Creature_Card } from '../../Interfaces/creature_card';

@Injectable({
  providedIn: 'root',
})

export class BattleService {
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

    currentPlayer: number = 0;
    movingPlayer: number = 0;

    successfulAttack = signal<boolean>(false);

    winner = signal<Creature_Card>({
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
    // look at using behavior subjects for observers
    // also lok at using this for health points

    loser = signal<Creature_Card>({
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

    setCurrentPlayer(player: number) {
        this.currentPlayer=player;
    }

    getCurrentPlayer() : number {
        return this.currentPlayer;
    }

    setMovingPlayer() { //this and one below should be moved to own service and done better somehow
        if (this.movingPlayer === 0){
            this.movingPlayer = 1;
        }

        this.movingPlayer === 1 ? 2 : 1;
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

    getWinner(){
        return this.winner();
    }

    getBattleResult(){
        return this.successfulAttack();
    }

    setWinner(winner: Creature_Card){
        this.winner.set(winner);
    }

    setLoser(loser: Creature_Card){
        this.loser.set(loser);
    }

    setSuccessfulAttack(value: boolean){
        this.successfulAttack.set(value);
    }

    setBattleAfterMath(previousState: Creature_Card[] | any): Creature_Card[] {
        previousState.at(0).Abilities = this.winner().Abilities;
        previousState.at(0).Elements = this.winner().Elements;
        previousState.at(0).Energy = this.winner().Energy;
        previousState.at(0).Max_Energy = this.winner().Max_Energy;
        previousState.at(0).Mugic_Counter = this.winner().Mugic_Counter;
        previousState.at(0).Player = this.winner().Player;
        previousState.at(0).Stats = this.winner().Stats;

        return previousState.at(0);
    }

    resetWinner(){
        this.winner.set({
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
    }

    resetLoser(){
        this.loser.set({
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
    }
}