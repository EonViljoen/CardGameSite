import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from '../../Dialogs/notification-dialog/notification-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly notificationDialog = inject(MatDialog);

  constructor() { }

  showNotification(message: string, timer: boolean){
    this.notificationDialog.open(NotificationDialogComponent, {
      data: {
        message: message,
        timer: timer
      }
    });
  }
}
