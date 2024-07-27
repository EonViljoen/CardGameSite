import { Component, inject } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray, transferArrayItem, CdkDropListGroup} from '@angular/cdk/drag-drop'; //Sort this out later
import {MatCardModule} from '@angular/material/card';
import { Creature_Card } from '../../shared/Interfaces/creature_card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog } from '@angular/material/dialog';
import { BattleDialogComponent } from '../../Dialogs/battle-dialog/battle-dialog.component';
import { BattleService } from '../../shared/services/battle.service';
import { FieldService } from '../../shared/services/field.service';
import { CardService } from '../../shared/services/card.service';
import { v4 as uuidv4 } from 'uuid';
import { CardComponent } from "../card/card.component";
import { Mugic_Card } from '../../shared/Interfaces/mugic_card';
import { Strike_Card } from '../../shared/Interfaces/strike_card';
import * as jsonData from '../../../assets/cardInformation.json'; //This gotta be fixed
import { Player } from '../../shared/Interfaces/player';
import { CommonModule } from '@angular/common';
import { TurnWindowComponent } from "../turn-window/turn-window.component";


@Component({
    selector: 'app-game-board',
    standalone: true,
    templateUrl: './game-board.component.html',
    styleUrl: './game-board.component.scss',
    imports: [CdkDrag, CdkDragPreview, MatCardModule, CdkDropListGroup, CdkDropList, CardComponent, MatTooltipModule, CommonModule, TurnWindowComponent]
})

export class GameBoardComponent {

  readonly battleDialog = inject(MatDialog);

  private battleService = inject(BattleService);
  private cardService = inject(CardService);
  private fieldService = inject(FieldService)

  // + (Math.floor(Math.random() * (25 - (-25) + 1)) + (-25)), , // Maybe make this a cool variance based on class or Tribe or something like that with delta configurable


  leftPlayer : Player = {
    Id: 1,
    Field: []
  }
  rightPlayer : Player = {
    Id: 2,
    Field: []
  }

  board : any = {
    left: this.leftPlayer,
    right: this.rightPlayer
  }

  ngOnInit(){

    this.buildGame();
    this.buildHand();
  }

  ngAfterViewInit(){

    let left = document.querySelector('.left-side');
    let right = document.querySelector('.right-side');

    let cardCount = (this.leftPlayer.Field.length ?? 0) + (this.rightPlayer.Field.length ?? 0);

    this.fieldService.cardDiamondArrangement(cardCount, left, right);
  }

  getCurrentPlayer() : number {
    return this.battleService.getCurrentPlayer();
  }

  isMovingPlayer(movingPlayerId : number): boolean {
    if (this.battleService.getMovingPlayer() === movingPlayerId){
      return true;
    }
    else{
      return false
    }
  }

  buildGame(){

    let movingPlayer = this.battleService.setMovingPlayer();  //needs to be observable because it no works dat good
    this.battleService.setCurrentPlayer(movingPlayer);

    this.leftPlayer.Field = this.getCreatures('Overworld', this.leftPlayer.Id);
    this.rightPlayer.Field = this.getCreatures('Underworld', this.rightPlayer.Id);

    this.board.left = this.leftPlayer;
    this.board.right = this.rightPlayer;

    this.fieldService.setLeft(this.leftPlayer);
    this.fieldService.setRight(this.rightPlayer);

    this.fieldService.setField(this.board);


  }

  buildHand() {

    this.cardService.addToDrawPile(this.getStrikes());
    this.cardService.shuffleCards(this.getDrawPile());
    this.cardService.addToHand(this.getMugic('Overworld'));
    
    this.cardService.drawCard(3);
  }

  getHand(): any[] {
    return this.cardService.getHand();
  }
  
  getDrawPile(): any[] {
    return this.cardService.getDrawPile();
  }
  getDiscardPile(): any[] {
    return this.cardService.getDiscardPile();
  }
  getRecyclePile(): any[] {
    return this.cardService.getRecyclePile();
  }

  getCreatures(Tribe: string, playerNumber: number) : Creature_Card[] {
    let cards: any[] = [];

    jsonData.Creatures.map(x => {
      if (x.Tribe === Tribe){
        x.Creatures.map(y => {

          let cardList = this.buildCreature(y, playerNumber);
          cards.push(cardList);
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

  getMugic(Tribe: string) : Mugic_Card[] {
    let cards: Mugic_Card[] = [];

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
      Type: 'Mugic',
      Effect: info.Effect,
      Picture: info.Picture
      };

      return card
  }

    getStrikes() : Strike_Card[] {
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

  arrangeHand(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.cardService.getHand(), 
      event.previousIndex, 
      event.currentIndex
    );
  }

  openDialog(event: CdkDragDrop<Creature_Card[]>){

    this.battleService.setDefender(<Creature_Card>event.container.data.at(0)); //correct way of setting them?, also is there better way than using at 0?
    this.battleService.setAttacker(<Creature_Card>event.previousContainer.data.at(0));    

    const dialogRef = this.battleDialog.open(BattleDialogComponent, {
      // maxWidth: '100vw', //review these 4 to see which is actually needed
      // maxHeight: '100vh',
      // width: '75%',
      data: { //Maybe don't need this anymore since I'm using service
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => { //don't fully understand how this works really, ask Alan

      
      if (result.battleOccurred){ // Good place for observer if battle happened maybe?
        transferArrayItem( //transfer loser
          result.loser.id === event.container.data.at(0)?.Id ? event.previousContainer.data : event.container.data ,
          this.cardService.getDiscardPile(),
          event.previousIndex,
          this.cardService.getDiscardPile().length + 1
        );

        transferArrayItem( //transfer winner
          event.previousContainer.data,
          event.container.data,        
          event.previousIndex,
          event.currentIndex
        );

          
        // need better way of doing this, need to use result.winner somehow
        let newState = this.setBattleAfterMath(result.winner);
        event.container.data.pop();
        event.container.data.push(newState);

        this.battleService.resetWinner();
        this.battleService.resetLoser();
      } 
      
      this.battleService.setMovingPlayer(); 

    });    
  }
}
