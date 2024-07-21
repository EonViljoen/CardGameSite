import { Injectable } from '@angular/core';
import { Mugic_Card } from '../../Interfaces/mugic_card';
import { Strike_Card } from '../../Interfaces/strike_card';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  drawPile: any[] = [];
  discardPile: any[] = [];
  recyclePile: any[] = [];
  hand: any[] = [];


  constructor() { }

  buildHand(cards: Mugic_Card[] | Strike_Card[]) {
    this.hand.push(cards);
  }

  buildDrawPile(cards: Strike_Card[]) {
    this.drawPile.push();
  }

  discardCard(card: any, index: number){

    if (card.Type === 'Strike'){
      this.recyclePile.push(this.hand.find(x => x.id === card.id));
      this.hand.splice(index,1);
    }
    else {
      this.discardPile.push(this.hand.find(x => x.id === card.id));
      this.hand.splice(index,1);
    } 
  }

  drawCard(drawTimes: number) {
    for(let i=0; i < drawTimes; i++){
      this.hand.push(this.drawPile.pop());
      }
    }

    getDrawPile() : any[] {
      return this.drawPile;
    }

    getHand() : Strike_Card[] | Mugic_Card[] {
      return this.hand;
    }

    getDiscardPile() : any[] {
      return this.discardPile;
    }

    getRecyclePile() : any[] {
      return this.recyclePile;
    }
}
