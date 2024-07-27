import { Component, inject } from "@angular/core";
import { BattleService } from "../../shared/services/battle.service";

@Component({
  selector: 'app-turn-window',
  standalone: true,
  imports: [],
  templateUrl: './turn-window.component.html',
  styleUrl: './turn-window.component.scss'
})
export class TurnWindowComponent {
  private battleService = inject(BattleService)

  currentPlayerTurn: number = 0;

  ngOnInit() {
    this.currentPlayerTurn = this.battleService.getMovingPlayer();
  }
}
