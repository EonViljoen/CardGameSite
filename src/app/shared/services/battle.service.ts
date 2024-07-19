import {Injectable, signal} from '@angular/core';
import { Card } from '../../Interfaces/card';

@Injectable({
  providedIn: 'root',
})

export class BattleService {
    attacker: Card = {
        id: '',
        name: '',
        picture: '',
        card: '',
        hp: 100,
        max_hp: 100,
        mugic_counter: 0,
        class: '',
        tribe: '',
        stats: {
            'courage': 0,
            'power': 0,
            'speed': 0,
            'wisdowm': 0,
        },
        elements: {},
        abilities: {},
        statuses: [{}],
        player: 0
    };
    defender: Card = {
        id: '',
        name: '',
        picture: '',
        card: '',
        hp: 100,
        max_hp: 100,
        mugic_counter: 0,
        class: '',
        tribe: '',
        abilities: {},
        elements: {},
        stats: {
            'courage': 0,
            'power': 0,
            'speed': 0,
            'wisdowm': 0,
        },
        statuses: [{}],
        player: 0
    }; 

    attackingCard: Card[] = [];
    defendingCard: Card[] = [];

    successfulAttack = signal<boolean>(false);

    winner = signal<Card>({
        id: '',
        name: '',
        picture: '',
        card: '',
        hp: 100,
        max_hp: 100,
        mugic_counter: 0,
        class: '',
        tribe: '',
        abilities: {},
        elements: {},
        stats: {},
        statuses: [{}],
        player: 0
    });
    // look at using behavior subjects for observers
    // also lok at using this for health points

    loser = signal<Card>({
        id: '',
        name: '',
        picture: '',
        card: '',
        hp: 100,
        max_hp: 100,
        mugic_counter: 0,
        class: '',
        tribe: '',
        abilities: {},
        elements: {},
        stats: {},
        statuses: [{}],
        player: 0
    });

    setAttacker(attacker: Card){ //better way of setting this?
        this.attacker.id = attacker.id;
        this.attacker.name = attacker.name;
        this.attacker.picture = attacker.picture;
        this.attacker.card = attacker.card;
        this.attacker.hp = attacker.hp;
        this.attacker.max_hp = attacker.max_hp;
        this.attacker.mugic_counter = attacker.mugic_counter;
        this.attacker.class = attacker.class;
        this.attacker.tribe = attacker.tribe;
        this.attacker.abilities = attacker.abilities;
        this.attacker.stats = attacker.stats;
        this.attacker.elements = attacker.elements;
        this.attacker.player = attacker.player;
    }

    setDefender(defender: Card){
        this.defender.id = defender.id;
        this.defender.name = defender.name;
        this.defender.picture = defender.picture;
        this.defender.card = defender.card;
        this.defender.hp = defender.hp;
        this.defender.max_hp = defender.max_hp;
        this.defender.mugic_counter = defender.mugic_counter;
        this.defender.class = defender.class;
        this.defender.tribe = defender.tribe;
        this.defender.abilities = defender.abilities;
        this.defender.stats = defender.stats;
        this.defender.elements = defender.elements;
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

    getBattleResult(){
        return this.successfulAttack();
    }

    setWinner(winner: Card){
        this.winner.set(winner);
    }

    setLoser(loser: Card){
        this.loser.set(loser);
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

    setBattleAfterMath(previousState: Card[] | any): Card[] {
        previousState.at(0).abilities = this.winner().abilities;
        previousState.at(0).elements = this.winner().elements;
        previousState.at(0).hp = this.winner().hp;
        previousState.at(0).max_hp = this.winner().max_hp;
        previousState.at(0).mugic_counter = this.winner().mugic_counter;
        previousState.at(0).player = this.winner().player;
        previousState.at(0).stats = this.winner().stats;

        return previousState.at(0);
    }

    resetWinner(){
        this.winner.set({
            id: '',
            name: '',
            picture: '',
            card: '',
            hp: 100,
            max_hp: 100,
            mugic_counter: 0,
            class: '',
            tribe: '',
            abilities: {},
            elements: {},
            stats: {},
            statuses: [{}],
            player: 0
        }); 
    }

    resetLoser(){
        this.loser.set({
            id: '',
            name: '',
            picture: '',
            card: '',
            hp: 100,
            max_hp: 100,
            mugic_counter: 0,
            class: '',
            tribe: '',
            abilities: {},
            elements: {},
            stats: {},
            statuses: [{}],
            player: 0
        }); 
    }
}