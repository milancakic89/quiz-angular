import { Component, Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root'})
export class DialogService {

    dialogRef = null;

    constructor(private dialog: MatDialog) {}

    openDialog(component: any, data: any) {
        this.dialogRef = this.dialog.open(component, {
          data // Passing data to dialog
        });
    }
}