import { Card } from "./card";

export interface Battle {
    attacker: Card,
    defender: Card,
    hand: any[]
}
