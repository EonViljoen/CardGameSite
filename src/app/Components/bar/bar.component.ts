import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss'
})
export class BarComponent {

  @Input() current: number = 0; 
  @Input() max: number = 100;
  @Input() icon: string = ""

  getPercentage(): number {

    return Math.max(0, Math.min(100, (this.current / this.max) * 100));
  }

  getIcon(icon: string | undefined) {
    if (icon){
      return icon;
    }
    else{
      return ""
    }
  }
}
