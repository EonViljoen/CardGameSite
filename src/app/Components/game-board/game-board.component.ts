import {Component, inject } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray, transferArrayItem, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import { Creature_Card } from '../../Interfaces/creature_card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { BattleService } from '../../shared/services/battle.service';
import { v4 as uuidv4 } from 'uuid';
import { CardComponent } from "../card/card.component";
import { Mugic_Card } from '../../Interfaces/mugic_card';
import { Strike_Card } from '../../Interfaces/strike_card';
import * as jsonData from '../../../assets/cardInformation.json'; //This gotta be fixed
import { Player } from '../../Interfaces/player';


@Component({
    selector: 'app-game-board',
    standalone: true,
    templateUrl: './game-board.component.html',
    styleUrl: './game-board.component.scss',
    imports: [CdkDrag, CdkDragPreview, MatCardModule, CdkDropListGroup, CdkDropList, CardComponent, MatTooltipModule]
})

export class GameBoardComponent {

  readonly dialog = inject(MatDialog);
  private battleService = inject(BattleService);

  // + (Math.floor(Math.random() * (25 - (-25) + 1)) + (-25)),

  discardPile : any[] = [];
  drawPile: any[] = [];
  playPool: any[] = [];
  recyclePile : any[] = [];

  leftPlayer : Player = {
    Id: 1,
    Field: []
  }
  rightPlayer : Player = {
    Id: 2,
    Field: []
  }

  game : any = {
    left:{
      Id: 0,
      Field: []
    },
    right: {
      Id: 0,
      Field: []
    }
  }

  ngOnInit(){
    
    this.buildGame();
  }

  ngAfterViewInit(){
    let left = document.querySelector('.left-side');
    let right = document.querySelector('.right-side');
    let cardCount = (this.leftPlayer.Field.length ?? 0) + (this.rightPlayer.Field.length ?? 0);
    this.cardDiamondArrangement(cardCount, left, right);
  }

  buildGame(){

    this.leftPlayer.Field = this.getCreatures('Overworld', this.leftPlayer.Id);
    this.rightPlayer.Field = this.getCreatures('Underworld', this.rightPlayer.Id);
    this.game.left = this.leftPlayer;
    this.game.right = this.rightPlayer;

    this.playPool = this.getMugic('Overworld');
    this.drawPile = this.getStrikes();
    this.DrawCard(2);
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

  getCreatures(Tribe: string, playerNumber: number) : Creature_Card[] {
    let cards: any[] = [];

    jsonData.Creatures.map(x => {
      if (x.Tribe === Tribe){
        x.Creatures.map(y => {

          let cardList = this.buildCreature(y, playerNumber);
          cards.push(cardList)
        })
      }
    });

    

    return cards;
  }

  buildCreature(info: any, player: number) : Creature_Card[] {
    let card : Creature_Card = {
      Id: uuidv4(),
      Name: info.Name,
      Energy: info.Energy,
      Max_Energy: info.Max_Energy,
      Mugic_Counter: info.Mugic_Counters,
      Tribe: info.Tribe,
      Class: info.Class,
      Abilities : info.Abilities,
      Elements: info.Elements,
      Stats: info.Stats,
      Statuses: info.Statuses,
      Card: info.Card,
      Picture: info.Picture,
      Player: player
      };
    
    let singleCardList: Creature_Card[] = [];
    singleCardList.push(card);

      return singleCardList
  }

  getMugic(Tribe: string) : any[] {
    let cards: any[] = [];

    jsonData.Mugic.map(x => {
      if (x.Tribe === Tribe){
        x.Mugic.map(y => {

          let cardList = this.buildMugic(y);
          cards.push(cardList)
        })
      }
    });

    return cards;
  }

  buildMugic(info: any) : Mugic_Card {
    let card : Mugic_Card = {
      id: uuidv4(),
      Name: info.Name,
      Cost: info.Cost,
      Tribe: info.Tribe,
      Type: 'Mugic',
      Effect: info.Effect,
      Picture: info.Picture
      };

      return card
  }

    getStrikes() : any[] {
      let cards: Strike_Card[] = [];
  
      jsonData.Strike.map(x => {
        cards.push(this.buildStrike(x))
        
      });
      
      return cards;
    }

    buildStrike(info: any) : Strike_Card {
      let card : Strike_Card = {
        id: uuidv4(),
        Name: info.Name,
        Cost: info.Cost,
        Type: 'Strike',
        Effect: info.Effect,
        Picture: info.Picture
        };
  
        return card
    }

  discardCard(card: Mugic_Card | Strike_Card, index: number){

    if (card.Type === 'Strike'){
      this.recyclePile.push(this.playPool.find(x => x.id === card.id));
      this.playPool.splice(index,1);
    }
    else {
      this.discardPile.push(this.playPool.find(x => x.id === card.id));
      this.playPool.splice(index,1);
    } 
  }

  DrawCard(drawTimes: number) {
    for(let i=0; i < drawTimes; i++){
      this.playPool.push(this.drawPile.pop());
      }
    }

  setBattleAfterMath(winner: Creature_Card): Creature_Card {
    winner.Abilities = this.battleService.getWinner().Abilities;
    winner.Elements = this.battleService.getWinner().Elements;
    winner.Energy = this.battleService.getWinner().Energy;
    winner.Max_Energy = this.battleService.getWinner().Max_Energy;
    winner.Mugic_Counter = this.battleService.getWinner().Mugic_Counter;
    winner.Player = this.battleService.getWinner().Player;
    winner.Stats = this.battleService.getWinner().Stats;
    winner.Statuses = this.battleService.getWinner().Statuses;
    // can change

    return winner;
  }

  drop(event: CdkDragDrop<Creature_Card[]>) {
    if (event.container.data.length){// they fight, loser moves to discard pile and winner takes that spot
      if (event.container.data.at(0)?.Id !== event.item.dropContainer.data.at(0).Id && //check that it's not the same spot
      event.container.data.at(0)?.Player !== event.item.dropContainer.data.at(0).Player){ //check that it's not the same team
        this.openDialog(event);
      }
    }
    else {
      transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
    }
    
  }

  openDialog(event: CdkDragDrop<Creature_Card[]>){

    this.battleService.setDefender(<Creature_Card>event.container.data.at(0)); //correct way of setting them?, also is there better way than using at 0?
    this.battleService.setAttacker(<Creature_Card>event.previousContainer.data.at(0));
    this.battleService.setAttackingCard(event.previousContainer.data);
    this.battleService.setDefendingCard(event.container.data);
    

    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: '100vw', //review these 4 to see which is actually needed
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: { //Maybe don't need this anymore since I'm using service
        defender : event.container.data,
        attacker : event.previousContainer.data,
        hand: this.playPool
      },
    });

    dialogRef.afterClosed().subscribe(result => { //don't fully understand how this works really, ask Alan

      
      if (result.battleOccurred){ // Good place for observer if battle happened maybe?
        transferArrayItem( //transfer loser
          result.loser.id === event.container.data.at(0)?.Id ? event.container.data : event.previousContainer.data ,
          this.discardPile,
          event.previousIndex,
          this.discardPile.length + 1
        );


        this.battleService.getWinner().Statuses.map((x: { [x: string]: string; }) => {
            console.log('ping')
            console.log(x)
            console.log(x['Movement'] )
            if (x['Movement'] !== 'x'){
              transferArrayItem( //transfer winner
                event.previousContainer.data,
                event.container.data,        
                event.previousIndex,
                event.currentIndex
              );
            }
          }
        )

          
        // need better way of doing this, need to use result.winner somehow
        let newState = this.setBattleAfterMath(result.winner);
        event.container.data.pop();
        event.container.data.push(newState);

        this.battleService.resetWinner();
        this.battleService.resetLoser();
      } 
      
    })
  }

  arrangeHand(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.playPool, 
      event.previousIndex, 
      event.currentIndex
    );
  }


}
