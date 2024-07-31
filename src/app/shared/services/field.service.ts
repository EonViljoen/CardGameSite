import { Injectable } from '@angular/core';
import { Player } from '../Interfaces/player';
import { Creature_Card } from '../Interfaces/creature_card';

@Injectable({
  providedIn: 'root',
})

export class FieldService {

  field: any = {}; //should be used as a representation of the field

  // leftField: any[] = []; //these 2 go into above one
  // rightField: any[] = [];

  leftPlayer : Player = { //these two should maybe just be indication of players
      Id: 1,
      Field: []
    };
    rightPlayer : Player = {
      Id: 2,
      Field: []
    };
    
    leftPlayerCreatures: any[] = [];
    rightPlayerCreatures: any[] = [];
    

    setRightPlayer(rightPlayer: Player) { // change to be in setField, same below
      this.rightPlayer = rightPlayer;
      this.rightPlayerCreatures = JSON.parse(JSON.stringify(this.rightPlayer.Field));
    }

    setLeftPlayer(leftPlayer: Player) {
        this.leftPlayer = leftPlayer;
        this.leftPlayerCreatures = JSON.parse(JSON.stringify(this.leftPlayer.Field));
    }

    setField(board: any){

      // board.left['Field'].forEach((card: any) => {
      //   this.leftField.push(card[0]); //change that it doesn't use [0]
      // });


      // field.right['Field'].forEach((card: any) => {
      //   this.rightField.push(card[0]);
      // });

      this.field = {
        left: board.left,
        right: board.right
      }
    }

    getField(): any[]{

      return this.field;
    }

    getLeftPlayer() {
      return this.leftPlayer;
    }

    getRightPlayer() {
      return this.rightPlayer;
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

    async creatureHasMoved(card: any){

      console.log(' hit in creature has moved')
      console.log('card that moved')
      console.log(card)

      if (this.leftPlayer.Id === card.Player){

        this.leftPlayerCreatures.map(x => {
          if (x[0].Id === card.Id){

            console.log('has moved before')
            console.log(x[0].has_Moved)
            console.log(card.has_Moved)

            x[0].has_Moved = true;
            card.has_Moved = true;

            console.log('has moved after')
            console.log(x[0].has_Moved)
            console.log(card.has_Moved)
          }
        });
    }
    else {

      this.rightPlayerCreatures.map(x => {
        if (x[0].Id === card.Id){

          console.log('has moved before')
          console.log(x)
          console.log(card)


          x[0].has_Moved = true;
          card.has_Moved = true;

          console.log('has moved after')
          console.log(x)
          console.log(card)

        }
      });
    }


  }

  hasCreatureMoved(card: any): boolean{

    return card.has_Moved;
    // if (this.leftPlayer.Id === card.Player){

    //   this.leftPlayerCreatures.map(x => {
    //     if (x[0].Id === card.Id){
    //       return x[0]['has_Moved'];
    //     }
    //   });
    // }
    // else {

    //   this.rightPlayerCreatures.map(x => {
    //     if (x[0].Id === card.Id){
    //       return x[0]['has_Moved'];
    //     }
    //   });
    // }

    // return false;
  }

  async hasAllFinishedMoving(movingPlayer: number): Promise<boolean>{  

    if (this.leftPlayer.Id === movingPlayer){
      return this.leftPlayerCreatures.every(x => x[0].has_Moved === true)
    }
    else {
      return this.rightPlayerCreatures.every(x => x[0].has_Moved === true)
    }
  }

  resetCreatureMovement(player: number, field: any){

    console.log('reset')

    if (this.leftPlayer.Id === player){

      this.leftPlayerCreatures.forEach(x => {
        console.log('in left player creatures')
        console.log(x)
        console.log(x[0].has_Moved)
        x[0].has_Moved = false
        console.log('in left player creatures after resetting')
        console.log(x)
        console.log(x[0].has_Moved)
      })

      // this.leftPlayerCreatures.forEach(x => x[0].has_Moved = false);
      // this.leftPlayer.Field.forEach(x => x.has_Moved = false);
    }
    else{

      this.rightPlayerCreatures.forEach(x => {
        console.log(x)
        x[0].has_Moved = false
        console.log(x)
      })
      // this.rightPlayerCreatures.forEach(x => x[0].has_Moved = false);
      // this.rightPlayer.Field.forEach(x => x.has_Moved = false);
    }
  }

  removeFromPlayer(card: any){ //is this a dumb way of doing this?
    
    let value: any[] = [];

    if (this.leftPlayer.Id === card.Player){

      value = this.leftPlayerCreatures;
      value = value.filter(item => item[0].Id !== card.Id);
      this.leftPlayerCreatures = value;

    }
    else {

      value = this.rightPlayerCreatures;
      value = value.filter(item => item[0].Id !== card.Id);
      this.rightPlayerCreatures = value;
    }
  }

  object2Array(obj: Object){
    return Object.entries(obj).map(([key, value]) => ({key, value}));
  }

}