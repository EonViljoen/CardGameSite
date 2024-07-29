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

  title: string = ""
  message: string = "";
  timer: boolean = false;

  ngOnInit(){

    // this.notificationDialog.updateSize('50%', '50%');

    this.message = this.notificationData.message;
    this.timer = this.notificationData.timer;
    this.title = this.notificationData.title;

    if (this.timer){
      setTimeout(() => {
        this.notificationDialog.close();
      }, 1000);
    }
  }

  closeNotification(){
    this.notificationDialog.close();
  }
}
