export interface Card {
    id: string;
    name: string;
    picture: string;
    card: string;
    hp: number;
    max_hp: number;
    mugic_counter: number;
    tribe: string;
    class: string;
    stats: { [key: string]: number };
    elements: { [key: string]: boolean };
    abilities: { [key: number]: string };
    player: number;
}
