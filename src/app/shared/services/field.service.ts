import { Injectable } from '@angular/core';
import { Player } from '../Interfaces/player';

@Injectable({
  providedIn: 'root',
})

export class FieldService {

    field: any = {};

    leftField: any[] = [];
    rightField: any[] = [];

    leftPlayer : Player = {
        Id: 1,
        Field: []
      }
      rightPlayer : Player = {
        Id: 2,
        Field: []
      }
    

    setRight(rightPlayer: Player) { // change to be in setField, same below
      this.rightPlayer = rightPlayer;
    }
    setLeft(leftPlayer: Player) {
        this.leftPlayer = leftPlayer;
    }

    setField(field: any){

      // let left = field.leftPlayer.filter((x: any) => {
      //   x.Id === '1'
      // });

      // let right = field.filter((x: any) => {
      //   x.Id === '2'
      // });

      field.left['Field'].forEach((card: any) => {
        this.leftField.push(card[0]); //change that it doesn't use [0]
      });


      field.right['Field'].forEach((card: any) => {
        this.rightField.push(card[0]);
      });

      this.field = {
        left: this.leftField,
        right: this.rightField
      }
    }

    getField(): any[]{

      return this.field;
    }

    cardDiamondArrangement(cardCount: number, leftPlayer: any, rightPlayer : any ) : void{

      const columns = Math.ceil(Math.sqrt(cardCount));
      const CardAmount = Math.ceil(cardCount / columns);
      let amount = CardAmount;
      let cardCounter = CardAmount;  
      let leftChildren = leftPlayer.children;   
      let rightChildren = rightPlayer.children;   
    
      for (let items of leftChildren){
        if (cardCounter !== 0){
          
              cardCounter--;
            }
            else{
              let colBreakLeft = document.createElement('div');
              colBreakLeft.className = 'card-column-break'
              leftPlayer?.insertBefore(colBreakLeft , items)
              cardCounter = --amount;
            }    
          }
  
        amount = CardAmount;
        cardCounter = CardAmount;
  
        for (let items of rightChildren){
  
          if (cardCounter !== 0){
                cardCounter--;
              }
              else{
    
                let colBreakRight = document.createElement('div');
                colBreakRight.className = 'card-column-break'
                rightPlayer?.insertBefore(colBreakRight , items)
                cardCounter = --amount;  
              }    
          }
    }

}