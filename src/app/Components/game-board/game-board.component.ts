import {Component, inject } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray, transferArrayItem, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import { Card } from '../../Interfaces/card';
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
import { Game } from '../../Interfaces/game';


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

  // card1 : Card = { //these  need to move to individual card component eventually and be made dynamic
  //   id: uuidv4(),
  //   name: "Maxxor",
  //   hp: 20,
  //   max_hp: 100,
  //   mugic_counter: 3,
  //   tribe: 'Overworld',
  //   class: '',
  //   abilities: {
  //     'flurish': ' Mugic ? Generic ? 1 | [HP : x : 15] ? x ? Target | Check : Elements ? [earth : true] , [water : true] ? OR ? Target',
  //     'stasis': ' Mugic ? Overworld ? 1 | [Movement : x : x] ? x ? Target | x',
  //     'casualty': ' Mugic ? Underworld ? 1 | [HP : x : -20] ? x ? Target | x',
  //     'ember': ' Strike | Target | 5 : 5 : 0 : 0 : 0 | [Stats : wisdom : -25] ? x ? Opposing | Check : Elements ? [fire : true] ? x ? Self', 
  //     'incinerase': ' Strike | Target | 0 : 10 : 0 : 0 : 0 | [Elements : fire : x] ? x ? Self | Check : Elements ? [fire : true] ? x ? Self', 
  //     'pebble': ' Strike | Target | 0 : 0 : 5 : 5 : 0 | x | x', 
  //     'rust': ' Strike | Target | 0 : 0 : 0 : 5 : 5 | [HP : x : -10] ? x ? Opposing | Challenge : Stats ? [courage : 15] ? x ? Self',  
  //   },
  //   elements: {
  //     'fire': true,
  //     'air' : false,
  //     'earth' : true,
  //     'water' : false,
  //   },
  //   stats: {
  //     'courage': 100,
  //     'power': 100,
  //     'wisdom': 80,
  //     'speed': 50 + (Math.floor(Math.random() * (25 - (-25) + 1)) + (-25)),
  //   },
  //   statuses: [{}],
  //   card: '',
  //   picture: "./assets/pictures/Creatures/Overworlder/Maxxor_Picture.png",
  //   player: 1
  // };
  // card2 : Card = {
  //   id: uuidv4(),
  //   name: "Chaor",
  //   hp: 5,
  //   max_hp: 100,
  //   mugic_counter: 3,
  //   tribe: 'Underworld',
  //   class: '',
  //   abilities: {
  //     'flurish': ' Mugic ? Generic ? 1 | [HP : x : 15] ? x ? Target | Check : Elements ? [earth : true] , [water : true] ? OR ? Target',
  //     'stasis': ' Mugic ? Overworld ? 1 | [Movement : x : x] ? x ? Target | x',
  //     'casualty': ' Mugic ? Underworld ? 1 | [HP : x : -20] ? x ? Target | x',
  //     'ember': ' Strike | Target | 5 : 5 : 0 : 0 : 0 | [Stats : wisdom : -25] ? x ? Opposing | Check : Elements ? [fire : true] ? x ? Self', 
  //     'incinerase': ' Strike | Target | 0 : 10 : 0 : 0 : 0 | [Elements : fire : x] ? x ? Self | Check : Elements ? [fire : true] ? x ? Self', 
  //     'pebble': ' Strike | Target | 0 : 0 : 5 : 5 : 0 | x | x', 
  //     'rust': ' Strike | Target | 0 : 0 : 0 : 5 : 5 | [HP : x : -10] ? x ? Opposing | Challenge : Stats ? [courage : 15] ? x ? Self',  
  //   },
  //   elements: {
  //     'fire': true,
  //     'air' : false,
  //     'earth' : false,
  //     'water' : false,
  //   },
  //   stats: {
  //     'courage': 80,
  //     'power': 100,
  //     'wisdom': 80,
  //     'speed': 50 + (Math.floor(Math.random() * (25 - (-25) + 1)) + (-25)),
  //   },
  //   statuses: [{}],
  //   card: '',
  //   picture: "./assets/pictures/Creatures/Underworlder/Chaor_Picture.png",
  //   player: 2
  // };
  // card3 : Card = { //these 2 need to move to individual card component eventually and be made dynamic
  //   id: uuidv4(),
  //   name: "Vidav",
  //   hp: 15,
  //   max_hp: 100,
  //   mugic_counter: 3,
  //   tribe: 'Overworld',
  //   class: '',
  //   abilities: {
  //     // Mugic -  Type of Action ? Restriction ? Cost  | Target ? Self/Target | Affecting ? specific [Key : Quantity] , ... | Quantity | Criteria ? [Key : Quantity] , ...
  //     // Strike - Type of Action ? Restriction  | Target ? Self/Target | Damage with Elements | Affecting ? specific [Key : Quantity] ? Target , ... |  Criteria ? [Key : Quantity] , ...
  //     // Passives - TBD
  //     // 'heal': ' Mugic ? Overworld ? 1 | Self | HP | +15 | x', 
  //     // 'flurish': ' Mugic ? Generic ? 1 | Target | HP | +15 | Check : Elements ? [earth : true] , [water : true] ? OR ? Target',
  //     // 'stasis': ' Mugic ? Overworld ? 1 | Target | Movement | Stop | x',
  //     // 'casualty': ' Mugic ? Underworld ? 1 | Target | HP | -20 | x',
  //     // 'ember': ' Strike | Target | 5 : 5: 0: 0: 0 | Stats ? [wisdom : -25] ? Opposing | Check : Elements ? [fire : true] ? x ? Self', 
  //     // 'incinerase': ' Strike | Target | 0 : 10: 0: 0: 0 | Elements ? [fire : x] ? Self | Check : Elements ? [fire : true] ? x ? Self', 
  //     // 'pebble': ' Strike | Target | 0 : 0: 5: 5: 0 | x | x', //
  //     // 'rust': ' Strike | Target | 5 : 5: 0: 0: 0 | HP ? -10 ? Opposing | Challenge : Stats ? [courage : 15] ? x ? Self', 
  //   },
  //   elements: {
  //     'fire': true,
  //     'earth' : true,
  //     'water' : true,
  //     'air' : true,
  //   },
  //   stats: {
  //     'courage': 75,
  //     'power': 100,
  //     'wisdom': 80,
  //     'speed': 50 + (Math.floor(Math.random() * (25 - (-25) + 1)) + (-25)),
  //   },
  //   statuses: [{}],
  //   card: '',
  //   picture: "./assets/pictures/Creatures/Overworlder/Vidav_Picture.png",
  //   player: 1
  // };
  // card4 : Card = {
  //   id: uuidv4(),
  //   name: "H'earing",
  //   hp: 100,
  //   max_hp: 100,
  //   mugic_counter: 3,
  //   tribe: '',
  //   class: '',
  //   abilities: {
  //     0: 'Attack | 50 | x',
  //     1: 'Mugic Heal |  x | 1',
  //   },
  //   elements: {
  //     'fire': true,
  //     'earth' : true,
  //     'water' : true,
  //     'air' : true,
  //   },
  //   stats: {
  //     'courage': 100,
  //     'power': 100,
  //     'wisdom': 80,
  //     'speed': 50 + (Math.floor(Math.random() * (25 - (-25) + 1)) + (-25)),
  //   },
  //   statuses: [{}],
  //   card: '',
  //   picture: "./assets/pictures/Creatures/Underworlder/H'earing_Picture.png",
  //   player: 2
  // };
  // card5 : Card = {
  //   id: uuidv4(),
  //   name: "Dractyl",
  //   hp: 100,
  //   max_hp: 100,
  //   mugic_counter: 3,
  //   tribe: '',
  //   class: '',
  //   abilities: {
  //     0: 'Attack | 50 | x',
  //     1: 'Mugic Heal |  x | 1',
  //   },
  //   elements: {
  //     'fire': true,
  //     'earth' : true,
  //     'water' : true,
  //     'air' : true,
  //   },
  //   stats: {
  //     'courage': 100,
  //     'power': 100,
  //     'wisdom': 80,
  //     'speed': 50 + (Math.floor(Math.random() * (25 - (-25) + 1)) + (-25)),
  //   },
  //   statuses: [{}],
  //   card: '',
  //   picture: "./assets/pictures/Creatures/Overworlder/Dractyl_Picture.png",
  //   player: 1
  // };
  // card6 : Card = {
  //   id: uuidv4(),
  //   name: "Pyrithion",
  //   hp: 15,
  //   max_hp: 100,
  //   mugic_counter: 3,
  //   tribe: 'Underworld',
  //   class: '',
  //   abilities: {
  //     // 0: ' Mugic ? Overworld ? 1 | Self | HP | +15 | x', 
  //     // 1: ' Mugic ? Generic ? 1 | Target | HP | +15 | Check : Elements ? [earth : true] , [water : true] ? OR ? Target',
  //     // 2: ' Mugic ? Overworld ? 1 | Target | Movement | Stop | x',
  //     // 3: ' Mugic ? Underworld ? 1 | Target | HP | -20 | x',
  //     // 4: ' Strike | Target | 5 : 5: 0: 0: 0 | Stats ? [wisdom : -25] ? Opposing | Check : Elements ? [fire : true] ? x ? Self', 
  //     // 5: ' Strike | Target | 0 : 10: 0: 0: 0 | Elements ? [fire : x] ? Self | Check : Elements ? [fire : true] ? x ? Self', 
  //     // 6: ' Strike | Target | 0 : 0: 5: 5: 0 | x | x', //
  //     // 7: ' Strike | Target | 5 : 5: 0: 0: 0 | HP ? -10 ? Opposing | Challenge : Stats ? [courage : 15] ? x ? Self', 
  //   },
  //   elements: {
  //     'fire': true,
  //     'earth' : true,
  //     'water' : true,
  //     'air' : true,
  //   },
  //   stats: {
  //     'courage': 45,
  //     'power': 100,
  //     'wisdom': 80,
  //     'speed': 50 + (Math.floor(Math.random() * (25 - (-25) + 1)) + (-25)),
  //   },
  //   statuses: [{}],
  //   card: '',
  //   picture: "./assets/pictures/Creatures/Underworlder/Pyrithion_Picture.png",
  //   player: 2
  // };



// Maybe change first dimension to array to object?
// Game, player and card object
// Figure this out



  // cards: Card[][][] = [ //All cards --game
  //     [ //a player's cards --left 
  //       [this.card1], //single instance of card (needs to be list due to hoe cdkDrop works)
  //       [this.card3],
  //       [this.card5],
  //     ],
  //     [
  //       [this.card2],
  //       [this.card4],
  //       [this.card6],
  //     ]
  // ];

  mugic_cards : Mugic_Card[] = [
    {
      id: uuidv4(),
      name: 'Canon of Casualty',
      type: 'Mugic',
      tribe: 'Underworld',
      cost: 1,
      effect: '',
      picture: `./assets/pictures/Mugic/Underworld/Canon_of_Casualty_Picture.png`
    },
    {
      id: uuidv4(),
      name: 'Song of Stasis',
      type: 'Mugic',
      tribe: 'Overworld',
      cost: 1,
      effect: '',
      picture: `./assets/pictures/Mugic/Overworld/Song_of_Stasis_Picture.png`
    },
    {
      id: uuidv4(),
      name: 'Geo Flourish',
      type: 'Mugic',
      tribe: 'Generic',
      cost: 1,
      effect: '',
      picture: `./assets/pictures/Mugic/Generic/Geo_Flourish_Picture.png`
    },
  ]

  strike_cards: Strike_Card[] = [
    {
      id: uuidv4(),
      name: 'Incinerase',
      type: 'Strike',
      cost: 0,
      attack: 0,
      additional_attack: {
        'fire': 10
      },
      effect: '',
      picture: './assets/pictures/Strikes/Incinerase_Picture.png'
    },
    {
      id: uuidv4(),
      name: 'Ember Swarm',
      type: 'Strike',
      cost: 1,
      attack: 5,
      additional_attack: {
        'fire': 5
      },
      effect: '',
      picture: './assets/pictures/Strikes/Ember_Swarm_Picture.png'
    },
    {
      id: uuidv4(),
      name: 'Pebblestorm',
      type: 'Strike',
      cost: 1,
      attack: 0,
      additional_attack: {
        'air': 5,
        'earth': 5
      },
      effect: '',
      picture: './assets/pictures/Strikes/Pebblestorm_Picture.png'
    },
    {
      id: uuidv4(),
      name: 'Rustoxic',
      type: 'Strike',
      cost: 1,
      attack: 5,
      additional_attack: {
        'water': 5,
        'earth': 5
      },
      effect: '',
      picture: './assets/pictures/Strikes/Rustoxic_Picture.png'
    },
    
  ]

  discardPile : any[] = [];
  drawPile: any[] = [];
  hand: any[] = [];
  recyclePile : any[] = [];

  leftPlayer : Player = {
    id: 1,
    hand: []
  }
  rightPlayer : Player = {
    id: 2,
    hand: []
  }

  game : any = {
    left:{
      id: 0,
      hand: []
    },
    right: {
      id: 0,
      hand: []
    }
  }
  
  // game [
//   player 1  [
//      id
//      hand [
//       list with single card in[
//        card
//        ],
//       list with single card in[
//        card
//        ],
//     ],
//   ],  same for player 2
//   player 2 cards [
//     list with single card in [
//       card
//     ],
//     list with single card in [
//       card
//     ],
//   ]
// ]


  ngOnInit(){

    this.buildGame();

    this.mugic_cards.map(card => this.hand.push(card));
    this.strike_cards.map(card => this.drawPile.push(card));
    this.DrawCard(2);
  }

  ngAfterViewInit(){
    let left = document.querySelector('.left-side');
    let right = document.querySelector('.right-side');
    let cardCount = (this.leftPlayer.hand.length ?? 0) + (this.rightPlayer.hand.length ?? 0);
    this.cardDiamondArrangement(cardCount, left, right);
  }

  buildGame(){
    this.leftPlayer.hand = this.getCreatures('Overworld', this.leftPlayer.id);
    this.rightPlayer.hand = this.getCreatures('Underworld', this.rightPlayer.id);
    this.game.left = this.leftPlayer;
    this.game.right = this.rightPlayer;
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

  getCreatures(Tribe: string, playerNumber: number) : Card[] {
    let cards: any[] = [];

    jsonData.Creatures.map(x => {
      if (x.Tribe === Tribe){
        x.Creatures.map(y => {
          let cardList = this.buildCreature(y, playerNumber);
          console.log(cardList)

          cards.push(cardList)

        })
      }
    });



    return cards;
  }

  buildCreature(info: any, player: number) : Card[] {
    let card : Card = {
      id: uuidv4(),
      name: info.Name,
      hp: info.Energy,
      max_hp: info.Max_Energy,
      mugic_counter: info.Mugic_Counters,
      tribe: info.Tribe,
      class: info.Class,
      abilities : info.Abilities,
      elements: info.Elements,
      stats: info.Stats,
      statuses: info.Statuses,
      card: info.Card,
      picture: info.Picture,
      player: player
      };
    
    let singleCardList: Card[] = [];
    singleCardList.push(card);

    console.log(singleCardList)

      return singleCardList
  }

  discardCard(card: Mugic_Card | Strike_Card, index: number){

    if (card.type === 'Strike'){
      this.recyclePile.push(this.hand.find(x => x.id === card.id));
      this.hand.splice(index,1);
    }
    else {
      this.discardPile.push(this.hand.find(x => x.id === card.id));
      this.hand.splice(index,1);
    } 
  }

  DrawCard(drawTimes: number) {
    for(let i=0; i < drawTimes; i++){
      this.hand.push(this.drawPile.pop());
      }
    }

  setBattleAfterMath(winner: Card | any): Card {
    winner.abilities = this.battleService.getWinner().abilities;
    winner.elements = this.battleService.getWinner().elements;
    winner.hp = this.battleService.getWinner().hp;
    winner.max_hp = this.battleService.getWinner().max_hp;
    winner.mugic_counter = this.battleService.getWinner().mugic_counter;
    winner.player = this.battleService.getWinner().player;
    winner.stats = this.battleService.getWinner().stats;
    winner.statuses = this.battleService.getWinner().statuses;
    // can change

    return winner;
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.container.data.length){// they fight, loser moves to discard pile and winner takes that spot
      if (event.container.data.at(0)?.id !== event.item.dropContainer.data.at(0).id && //check that it's not the same spot
      event.container.data.at(0)?.player !== event.item.dropContainer.data.at(0).player){ //check that it's not the same team
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

  openDialog(event: CdkDragDrop<Card[]>){

    this.battleService.setDefender(<Card>event.container.data.at(0)); //correct way of setting them?, also is there better way than using at 0?
    this.battleService.setAttacker(<Card>event.previousContainer.data.at(0));
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
        hand: this.hand
      },
    });

    dialogRef.afterClosed().subscribe(result => { //don't fully understand how this works really, ask Alan

      
      if (result.battleOccurred){ // Good place for observer if battle happened maybe?
        transferArrayItem( //transfer loser
          result.loser.id === event.container.data.at(0)?.id ? event.container.data : event.previousContainer.data ,
          this.discardPile,
          event.previousIndex,
          this.discardPile.length + 1
        );


        this.battleService.getWinner().statuses.map(x => {
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
        let newState = this.setBattleAfterMath(event.container.data.at(0));
        event.container.data.pop();
        event.container.data.push(newState);

        this.battleService.resetWinner();
        this.battleService.resetLoser();
      } 
      
    })
  }

  arrangeHand(event: CdkDragDrop<Card[]>) {
    moveItemInArray(
      this.hand, 
      event.previousIndex, 
      event.currentIndex
    );
  }


}
