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
        Stats: {
            'courage': 0,
            'power': 0,
            'speed': 0,
            'wisdowm': 0,
        },
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
        Stats: {
            'courage': 0,
            'power': 0,
            'speed': 0,
            'wisdowm': 0,
        },
        Elements: {},
        Abilities: {},
        Statuses: [{}],
        Player: 0
    };
    attackingCard: Creature_Card[] = [];
    defendingCard: Creature_Card[] = [];

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

    setAttacker(attacker: Creature_Card){ //better way of setting this?
        this.attacker.Id = attacker.Id;
        this.attacker.Name = attacker.Name;
        this.attacker.Picture = attacker.Picture;
        this.attacker.Card = attacker.Card;
        this.attacker.Energy = attacker.Energy;
        this.attacker.Max_Energy = attacker.Max_Energy;
        this.attacker.Mugic_Counter = attacker.Mugic_Counter;
        this.attacker.Class = attacker.Class;
        this.attacker.Tribe = attacker.Tribe;
        this.attacker.Abilities = attacker.Abilities;
        this.attacker.Stats = attacker.Stats;
        this.attacker.Elements = attacker.Elements;
        this.attacker.Player = attacker.Player;
    }

    setDefender(defender: Creature_Card){
        this.defender.Id = defender.Id;
        this.defender.Name = defender.Name;
        this.defender.Picture = defender.Picture;
        this.defender.Card = defender.Card;
        this.defender.Energy = defender.Energy;
        this.defender.Max_Energy = defender.Max_Energy;
        this.defender.Mugic_Counter = defender.Mugic_Counter;
        this.defender.Class = defender.Class;
        this.defender.Tribe = defender.Tribe;
        this.defender.Abilities = defender.Abilities;
        this.defender.Stats = defender.Stats;
        this.defender.Elements = defender.Elements;
        this.defender.Player = defender.Player;
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

    setAttackingCard(card: Creature_Card[]){
        this.attackingCard = card;
    }

    setDefendingCard(card: Creature_Card[]){
        this.defendingCard = card;
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