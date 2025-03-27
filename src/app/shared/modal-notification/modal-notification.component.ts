import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-notification',
  imports: [CommonModule],
  templateUrl: './modal-notification.component.html',
  styleUrl: './modal-notification.component.scss',
  standalone: true
})
export class ModalNotificationComponent implements OnInit {

  header = 'something';

  confirm: any;
  cancel: any;

  constructor(
    public dialogRef: MatDialogRef<ModalNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(data?: any) {
    this.dialogRef.close(data);
  }

  ngOnInit(): void {
    this.confirm = this.data.confirm;
    this.cancel = this.data.cancel;
  }

  onConfirm(){
    this.confirm()
    this.closeDialog()
  }

  onCancel(){
    this.cancel();
    this.closeDialog()
  }
}
