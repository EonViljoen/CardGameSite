import {Injectable, signal} from '@angular/core';
import { Card } from '../../Interfaces/card';

@Injectable({
  providedIn: 'root',
})

export class BattleService {
    attacker: Card = {
        id: 0,
        name: '',
        picture: '',
        attack: 0,
        player: 0
    };
    defender: Card = {
        id: 0,
        name: '',
        picture: '',
        attack: 0,
        player: 0
    }; 

    attackingCard: Card[] = [];
    defendingCard: Card[] = [];

    winner = signal<Card>({
        id: 0,
        name: '',
        picture: '',
        attack: 0,
        player: 0
    }); //need to research signal more
    // look at using behavior subjects for observers
    // also lok at using this for health points

    loser = signal<Card>({
        id: 0,
        name: '',
        picture: '',
        attack: 0,
        player: 0
    }); //need to research signal more

    loserCard = signal<string>(''); //Check if this is even needed

    successfulAttack = signal<boolean>(false);

    setAttacker(attacker: Card){ //better way of setting this?
        this.attacker.id = attacker.id;
        this.attacker.name = attacker.name;
        this.attacker.picture = attacker.picture;
        this.attacker.attack = attacker.attack;
        this.attacker.player = attacker.player;
    }

    setDefender(defender: Card){
        this.defender.id = defender.id;
        this.defender.name = defender.name;
        this.defender.picture = defender.picture;
        this.defender.attack = defender.attack;
        this.defender.player = defender.player;
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

    getLoser(){
        return this.loser();
    }

    getLoserIndicator(){
        return this.loserCard();
    }

    getBattleResult(){
        return this.successfulAttack();
    }

    setWinner(winner: Card){
        // console.log('set winner in service called');
        // console.log(this.winner());
        this.winner.set(winner); // doesn't seem to work how I think it works
        // console.log('set winner in service being exited');
    }

    setLoser(loser: Card, whoLost: string){
        this.loser.set(loser);
        this.loserCard.set(whoLost);
    }

    setAttackingCard(card: Card[]){
        this.attackingCard = card;
    }

    setDefendingCard(card: Card[]){
        this.defendingCard = card;
    }

    setSuccessfulAttack(value: boolean){
        this.successfulAttack.set(value);
    }

    resetWinner(){
        this.winner.set({
        id: 0,
        name: '',
        picture: '',
        attack: 0,
        player: 0
        }); 
    }

    resetLoser(){
        this.loser.set({
        id: 0,
        name: '',
        picture: '',
        attack: 0,
        player: 0
        }); 
    }
}