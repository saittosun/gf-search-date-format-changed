import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  alertData: AlertData;

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) alertData: AlertData) {
      this.alertData = alertData;
    }

  onClose(): void {
    this.dialogRef.close();
  }

  onConfirmation(decision: boolean){
    this.dialogRef.close(decision);
  }
}

export interface AlertData{
  title: string,
  text: string[],
  type: string
}
