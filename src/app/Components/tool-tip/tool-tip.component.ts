import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tool-tip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-tip.component.html',
  styleUrl: './tool-tip.component.scss'
})
export class ToolTipComponent {
  @Input() card: string = "";
  @Input() type: string = "";

  getStyle(): any{

    let style: { [key: string]: string };

    switch (this.type){

      case "field":
        return  style = {
          'position': 'absolute',
          'left' : '10em'
        };

      case "hand":
        return  style = {
          'position': 'absolute',
          'right' : '-2em',
          'bottom' : '1em'
        };

      case "location":
        return "";
      default:
        return ""
    }
  }
}
