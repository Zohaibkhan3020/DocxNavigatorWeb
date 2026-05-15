import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-vault-dialog',
  templateUrl: './create-vault-dialog.component.html',
  styleUrl: './create-vault-dialog.component.css',
  standalone: false
})
export class CreateVaultDialogComponent {
 vaultName = '';
name = '';
  constructor(
    private dialogRef: MatDialogRef<CreateVaultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )  {
    // agar rename hai to prefill
    if (data.mode === 'Rename') {
      this.name = data.currentName;
    }
  }

  close() {
    this.dialogRef.close();
  }

  create() {

    if (!this.vaultName.trim())
      return;

    this.dialogRef.close({
      vaultName: this.vaultName
    });
  }
}
