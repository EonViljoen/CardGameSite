export interface Strike_Card {
    id: string;
    name: string;
    type: string;
    cost: number;
    attack: number;
    additional_attack: { [key: string]: number };
    effect: string;
    picture: string;
}
