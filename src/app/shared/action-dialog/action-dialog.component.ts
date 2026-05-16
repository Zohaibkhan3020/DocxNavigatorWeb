import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrl: './action-dialog.component.css',
  standalone: false
})
export class ActionDialogComponent {

  name = '';

  constructor(
    private dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // rename prefill
    if (data.mode === 'rename') {
      this.name = data.currentName;
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {

    if (this.data.mode !== 'delete') {

      if (!this.name.trim()) return;

      this.dialogRef.close({
        name: this.name
      });

      return;
    }

    this.dialogRef.close(true);
  }
}
