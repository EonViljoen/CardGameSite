import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tool-tip',
  standalone: true,
  imports: [],
  templateUrl: './tool-tip.component.html',
  styleUrl: './tool-tip.component.scss'
})
export class ToolTipComponent {
  @Input() card: string = "";
}
