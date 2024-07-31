export interface Creature_Card {
    Id: string;
    Name: string;
    Picture: string;
    Card: string;
    Energy: number;
    Max_Energy: number;
    Mugic_Counter: number;
    Tribe: string;
    Class: string;
    Stats: { [key: string]: number };
    Elements: { [key: string]: boolean };
    Abilities: { [key: string]: string };
    Statuses: [ {[key: string]: string}]
    Player: number;
    has_Moved: boolean;
}
