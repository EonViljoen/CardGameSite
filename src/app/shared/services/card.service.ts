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

  constructor(){
    
    // this.drawPile = [];
    // this.discardPile = [];
    // this.recyclePile = [];
    // this.hand = [];
  }

  addToHand(cards:any[]) {
    cards.forEach(card => {
      this.hand.push(card);
    });
  }

  addToDrawPile(cards: any[]) {
    cards.forEach(card => {
      this.drawPile.push(card);
    });
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
    console.log('draw')
    console.log(this.drawPile);
    console.log(this.hand);
    for(let i=0; i < drawTimes; i++){
      this.hand.push(this.drawPile.pop());
      }
      console.log(this.drawPile);
      console.log(this.hand);
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
