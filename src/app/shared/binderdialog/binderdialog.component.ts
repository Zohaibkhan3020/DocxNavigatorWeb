import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export interface BinderField {
  fieldName: string;
  fieldType: string;
  width: number;
  isUnique: boolean;
  isRequired: boolean;
  dropdownValue?: any;   // 👈 FIX ADDED
}

@Component({ selector: 'app-binderdialog', 
  templateUrl: './binderdialog.component.html', 
  styleUrl: './binderdialog.component.css', 
  standalone: false, // encapsulation: ViewEncapsulation.None 
  })
export class BinderdialogComponent {

  binderName = '';

  dropdownList: string[] = ['Option 1', 'Option 2', 'Option 3'];

  fieldTypes = ['Text', 'Number', 'Date', 'Boolean', 'Dropdown'];

  fields: BinderField[] = [
  {
    fieldName: 'Document ID',
    fieldType: 'Text',
    width: 50,
    isUnique: false,
    isRequired: true,
    dropdownValue: null
  },
  {
    fieldName: 'Document Name',
    fieldType: 'Text',
    width: 50,
    isUnique: false,
    isRequired: true,
    dropdownValue: null
  }
];

  // SINGLE FORM MODEL
  field: BinderField = {
    fieldName: '',
    fieldType: 'Text',
    width: 50,
    isUnique: false,
    isRequired: false,
    dropdownValue: null
  };

  constructor(private dialogRef: MatDialogRef<BinderdialogComponent>) {}

  addField() {

  if (!this.field.fieldName.trim()) return;

  const exists = this.fields.some(
    f => f.fieldName.toLowerCase() === this.field.fieldName.toLowerCase()
  );

  if (exists) return;

  this.fields.push({ ...this.field });

  this.field = {
    fieldName: '',
    fieldType: 'Text',
    width: 50,
    isUnique: false,
    isRequired: false,
    dropdownValue: null
  };
}

  removeField(index: number) {
    this.fields.splice(index, 1);
  }

  create() {

    if (!this.binderName.trim() || this.fields.length === 0)
      return;

    this.dialogRef.close({
      binderName: this.binderName,
      fields: this.fields
    });
  }

  close() {
    this.dialogRef.close();
  }
}