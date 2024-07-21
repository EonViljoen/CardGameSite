import { Creature_Card } from "./creature_card";

export interface Battle {
    attacker: Creature_Card,
    defender: Creature_Card,
    hand: any[]
}
