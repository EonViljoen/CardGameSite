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
import { ToolTipComponent } from "../tool-tip/tool-tip.component";


@Component({
    selector: 'app-game-board',
    standalone: true,
    templateUrl: './game-board.component.html',
    styleUrl: './game-board.component.scss',
    imports: [CdkDrag, CdkDragPreview, MatCardModule,
    CdkDropListGroup, CdkDropList, CardComponent, MatTooltipModule,
    CommonModule, TurnWindowComponent, ToolTipComponent]
})

export class GameBoardComponent {

  readonly battleDialog = inject(MatDialog);

  private battleService = inject(BattleService);
  private cardService = inject(CardService);
  private fieldService = inject(FieldService)

  showCard: boolean = false;

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

  cardsDisplayed: boolean[] = new Array(this.leftPlayer.Field.length + this.rightPlayer.Field.length).fill(false);
  handDisplayer: boolean[] = new Array(this.cardService.getHand().length);

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

  showFullCard(arr: boolean[], i: number, base: number){

    arr[base + i] = true;
  }

  hideFullCard(arr: boolean[], i: number, base: number){

    arr[base + i] = false;
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

    this.battleService.setMovingPlayer();  //needs to be observable because it no works dat good
    this.battleService.setCurrentPlayer();

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

    card = this.ajdustStats(card)
    
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
      Picture: info.Picture,
      Card: info.Card
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
        Picture: info.Picture,
        Card: info.Card
        };
  
        return card
    }

  ajdustStats(card: any){

    let statArr = this.object2Array(card.Stats)

    statArr.forEach(stat => {
      card.Stats[stat.key] =  this.generateRandomStat(card, stat.key, 0.5, 30)
    });   

    card = this.adjustSpecificStats(card);
    card  = this.adjustElements(card);

    return card;
  }

  adjustSpecificStats(card: any){

    if(card.Class.includes('Scout')){
      card.Stats['Speed'] = this.generateRandomStat(card, 'Speed', 0.25, 30);
    }

    if(card.Class.includes('Strategist')){
      card.Stats['Wisdom'] = this.generateRandomStat(card, 'Wisdom', 0.25, 30);
    }

    if(card.Class.includes('Warrior')){
      card.Stats['Power'] = this.generateRandomStat(card, 'Wisdom', 0.25, 30);
    }

    if(card.Class.includes('Commander')){
      card.Stats['Power'] = this.generateRandomStat(card, 'Power', 0.25, 10);
      card.Stats['Wisdom'] = this.generateRandomStat(card, 'Power', 0.25, 20);
    }

    switch (card.Tribe){
      case "Overworld":

        if(card.Class.includes('Hero')){
          card.Stats['Courage'] = this.generateRandomStat(card, 'Courage', 0.5, 20);
          card.Stats['Speed'] = this.generateRandomStat(card, 'Courage', 0.25, 10);
          card.Stats['Wisdom'] = this.generateRandomStat(card, 'Courage', 0.25, 10);
        }

        break;

      case "Underworld":

        if(card.Class.includes('Conqueror')){
          card.Stats['Courage'] = this.generateRandomStat(card, 'Courage', 0.25, 10);
          card.Stats['Speed'] = this.generateRandomStat(card, 'Courage', 0.25, 10);
          card.Stats['Power'] = this.generateRandomStat(card, 'Courage', 0.5, 20);
        }
        
        break;
  }; 

    return card;
  }

  adjustElements(card: any){
    
    let elementArr = this.object2Array(card.Elements);

    elementArr.forEach(element => {
      let prob = this.generateElementProbability(card, element)

      card.Elements[element.key] = prob
    });

    return card;
  }

  generateRandomStat(card: any, stat: any, bias: number, max: number){
    let min = 1;
    let genNum = Math.pow(Math.random(), bias);
    const range = max-min;

    let newStat = card.Stats[stat] + Math.floor(min + genNum * range)

    if(card.Stats[stat] <= 0){
      card.Stats[stat] = 5
    }
    if(card.Stats[stat] >= 100){
      card.Stats[stat] = 95
    }

    return newStat;  
  }

  generateElementProbability(card: any, element: any){

    let min = 1;
    let max = 100
    const range = max-min;

    if (card.Elements[element.key]){
      let genNum = Math.pow(Math.random(), 0.1);
      let prob = Math.floor(min + genNum * range)
      
      if (prob > 49){
        return true;     
      }
      else {
        return false;

      }
    }
    else{
      let genNum = Math.pow(Math.random(), 1.8);
      let prob = Math.floor(min + genNum * range)

      if (prob > 49){
        return true;
      }
      else {
        return false;
      }
    }
  }

  object2Array(obj: Object){
    return Object.entries(obj).map(([key, value]) => ({key, value}));
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
        let newState = result.winner;
        event.container.data.pop();
        event.container.data.push(newState);

        this.battleService.reset();
      } 
      
      this.battleService.setMovingPlayer(); 

    });    
  }
}
