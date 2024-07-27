import { Injectable } from '@angular/core';
import { Mugic_Card } from '../Interfaces/mugic_card';
import { Strike_Card } from '../Interfaces/strike_card';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  drawPile: any[] = [];
  discardPile: any[] = [];
  recyclePile: any[] = [];
  hand: any[] = [];

  constructor(){
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

  discardCard(card: any, index: any){

    if (this.hand.length <= 2){
      this.recycleCards();
    }

    if (index !== 'x'){
      if (card.Type === 'Strike'){
        this.recyclePile.push(this.hand.find(x => x.id === card.id));
        this.hand.splice(index,1);
      }
      else {
        this.discardPile.push(this.hand.find(x => x.id === card.id));
        this.hand.splice(index,1);
        // this.drawCard(1);
      }
    }
  }

  drawCard(drawTimes: number) {

    for(let i=0; i < drawTimes; i++){
      if (this.drawPile.length > 0){
        this.hand.push(this.drawPile.pop());
      }
    }
  }

  shuffleCards(cardPile: any[]){

    this.drawPile = cardPile.slice().sort(() => Math.random() - 0.5);
  }

  recycleCards() { //Refine a bit to where you only have 3 cards when in battle, not on field

    this.shuffleCards(this.recyclePile);
    this.drawCard(1);
  }

  getTribeColour(tribe: string){
    switch (tribe){
      case 'Overworld':
        return '#0000FF';
      case 'Underworld':
        return '#FF0000';
      default:
        return '808080'
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
