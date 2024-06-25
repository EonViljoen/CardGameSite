import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, CdkDrag],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() picture: string = ''
}
