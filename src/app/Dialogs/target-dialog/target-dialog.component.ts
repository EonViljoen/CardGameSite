import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbilityTarget } from '../../shared/Interfaces/ability_target';
import { FieldService } from '../../shared/services/field.service';
import {MatCardModule} from '@angular/material/card';
import { Creature_Card } from '../../shared/Interfaces/creature_card';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-target-dialog',
  standalone: true,
  imports: [MatCardModule, MatTooltipModule],
  templateUrl: './target-dialog.component.html',
  styleUrl: './target-dialog.component.scss'
})
export class TargetDialogComponent {

  readonly targetDialog = inject(MatDialogRef<TargetDialogComponent>);
  battleData = inject<AbilityTarget>(MAT_DIALOG_DATA);

  private fieldService = inject(FieldService);

  ngOnInit(){
    // this.targetDialog.updateSize('80%', '80%');
  }

  ngAfterViewInit() {
    let left = document.querySelector('.left-targets');
    let right = document.querySelector('.right-targets');


    
    this.fieldService.cardDiamondArrangement(
      (this.fieldService.leftPlayer.Field.length + this.fieldService.rightPlayer.Field.length),
      left,
      right
    );
  }

  getField(): any[] {
    return this.fieldService.getField();
  }

  getLeftField(): any {
    return this.fieldService.leftPlayer.Field;
  }

  getRightField(): any {
    return this.fieldService.rightPlayer.Field;
  }

  selectTarget(card: Creature_Card){

    this.targetDialog.close({
      target: card
    });
  }

}
