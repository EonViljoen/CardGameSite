import {Component, inject, signal} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray, transferArrayItem, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import { Card } from '../../Interfaces/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { BattleService } from '../../shared/services/battle.service';
import { Game } from '../../Interfaces/game';
import { Player } from '../../Interfaces/player';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CdkDrag, CdkDragPreview, MatCardModule, CdkDropListGroup, CdkDropList, ],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})

export class GameBoardComponent {
  readonly dialog = inject(MatDialog);
  private battleService = inject(BattleService);

  // TODO:
  // Fix weird one player placement thing - Done
  // Make battle screen more interactive and actually cool (attack, abilities, mugic counter)
  // Fix CSS and make it more dynamic
  // Move cards to actual component
  // Do strike cards and merge hand with dialog


  card1 : Card = { //these 2 need to move to individual card component eventually and be made dynamic
    id: uuidv4(),
    name: "Maxxor",
    hp: 100,
    max_hp: 100,
    mugic_counter: 3,
    tribe: '',
    class: '',
    abilities: {
      0: 'Attack | 50 | x',
      1: 'Mugic Heal |  x | 1',
    },
    elements: {
      'fire': true,
      'earth' : true,
      'water' : true,
      'air' : true,
    },
    stats: {
      'courage': 100,
      'power': 100,
      'wisdom': 80,
      'speed': 50,
    },
    card: '',
    picture: "./assets/pictures/Maxxor_Picture.png",
    player: 1
  };
  card2 : Card = {
    id: uuidv4(),
    name: "Chaor",
    hp: 100,
    max_hp: 100,
    mugic_counter: 3,
    tribe: '',
    class: '',
    abilities: {
      0: 'Attack | 50 | x',
      1: 'Mugic Heal |  x | 1',
    },
    elements: {
      'fire': true,
      'earth' : true,
      'water' : true,
      'air' : true,
    },
    stats: {
      'courage': 100,
      'power': 100,
      'wisdom': 80,
      'speed': 50,
    },
    card: '',
    picture: "./assets/pictures/Chaor_Picture.png",
    player: 2
  };
  card3 : Card = { //these 2 need to move to individual card component eventually and be made dynamic
    id: uuidv4(),
    name: "Vidav",
    hp: 100,
    max_hp: 100,
    mugic_counter: 3,
    tribe: '',
    class: '',
    abilities: {
      0: 'Attack | 50 | x',
      1: 'Mugic Heal |  x | 1',
    },
    elements: {
      'fire': true,
      'earth' : true,
      'water' : true,
      'air' : true,
    },
    stats: {
      'courage': 100,
      'power': 100,
      'wisdom': 80,
      'speed': 50,
    },
    card: '',
    picture: "./assets/pictures/Vidav_Picture.png",
    player: 1
  };
  card4 : Card = {
    id: uuidv4(),
    name: "H'earing",
    hp: 100,
    max_hp: 100,
    mugic_counter: 3,
    tribe: '',
    class: '',
    abilities: {
      0: 'Attack | 50 | x',
      1: 'Mugic Heal |  x | 1',
    },
    elements: {
      'fire': true,
      'earth' : true,
      'water' : true,
      'air' : true,
    },
    stats: {
      'courage': 100,
      'power': 100,
      'wisdom': 80,
      'speed': 50,
    },
    card: '',
    picture: "./assets/pictures/H'earing_Picture.png",
    player: 2
  };
  card5 : Card = {
    id: uuidv4(),
    name: "Dractyl",
    hp: 100,
    max_hp: 100,
    mugic_counter: 3,
    tribe: '',
    class: '',
    abilities: {
      0: 'Attack | 50 | x',
      1: 'Mugic Heal |  x | 1',
    },
    elements: {
      'fire': true,
      'earth' : true,
      'water' : true,
      'air' : true,
    },
    stats: {
      'courage': 100,
      'power': 100,
      'wisdom': 80,
      'speed': 50,
    },
    card: '',
    picture: "./assets/pictures/Dractyl_Picture.png",
    player: 1
  };
  card6 : Card = {
    id: uuidv4(),
    name: "Pyrithion",
    hp: 100,
    max_hp: 100,
    mugic_counter: 3,
    tribe: '',
    class: '',
    abilities: {
      0: 'Attack | 50 | x',
      1: 'Mugic Heal |  x | 1',
    },
    elements: {
      'fire': true,
      'earth' : true,
      'water' : true,
      'air' : true,
    },
    stats: {
      'courage': 100,
      'power': 100,
      'wisdom': 80,
      'speed': 50,
    },
    card: '',
    picture: "./assets/pictures/Pyrithion_Picture.png",
    player: 2
  };

// All cards [
//   player 1 cards [
//     list with single card in [
//       card
//     ],
//     list with single card in [
//       card
//     ],
//   ],
//   player 2 cards [
//     list with single card in [
//       card
//     ],
//     list with single card in [
//       card
//     ],
//   ]
// ]

// Maybe change first dimension to array to object?
// Game, player and card object
// Figure this out



cards: Card[][][] = [ //All cards
    [ //a player's cards
      [this.card1], //single instance of card (needs to be list due to hoe cdkDrop works)
      [this.card3],
      [this.card5]
    ],
    [
      [this.card2],
      [this.card4],
      [this.card6],
    ]
]

  discard : Card[] = [];
  draw: number[] = [
    1,2,3
  ];
  // hand1 : Card[] = [];
  // hand2 : Card[] = [];
  // player1 : Player = {}

  // buildGame(){
  //   this.hand1.push(this.card1);
  //   this.hand1.push(this.card3);
  //   this.hand1.push(this.card5);

  //   this.hand2.push(this.card2);
  //   this.hand2.push(this.card4);
  //   this.hand2.push(this.card6);


  // }

  discardCard(card: Card){
    this.discard.unshift(card);
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
        attacker : event.previousContainer.data
      },
    });

    dialogRef.afterClosed().subscribe(result => { //don't fully understand how this works really, ask Alan

      
      if (result.battleOccurred){ // Good place for observer if battle happened maybe?
        transferArrayItem( //transfer loser
          this.battleService.getBattleResult() ? event.container.data : event.previousContainer.data ,
          this.discard,
          event.previousIndex,
          this.discard.length + 1
        );
  
        if (this.battleService.getBattleResult()){
          transferArrayItem( //transfer winner
            event.previousContainer.data,
            event.container.data,        
            event.previousIndex,
            event.currentIndex
          );
        }
  
        this.battleService.resetWinner();
        this.battleService.resetLoser();
      } 
      
    })
  }

}
