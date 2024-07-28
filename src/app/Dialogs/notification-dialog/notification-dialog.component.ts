import { Component, inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Notification } from '../../shared/Interfaces/notifiaction';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [],
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss'
})
export class NotificationDialogComponent {
  readonly notificationDialog = inject(MatDialogRef<NotificationDialogComponent>);
  notificationData = inject<Notification>(MAT_DIALOG_DATA);

  message: string = "";
  timer: boolean = false;

  ngOnInit(){

    this.message = this.notificationData.message;
    this.timer = this.notificationData.timer;

    if (this.timer){
      setTimeout(() => {
        this.notificationDialog.close();
      }, 2000);
    }
  }
}
