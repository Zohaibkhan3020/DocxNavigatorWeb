import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css'],
  standalone: false
})
export class RightPanelComponent implements OnChanges {

  editMode = false;
metadataFields: any[] = [];
  // 🔥 VIEW
  @Input() activeView: 'preview' | 'metadata' | 'comments' = 'preview';
csvData: string[][] = [];
  // 🔥 FILE
 @Input() fileType: 'pdf' | 'csv' | 'excel' | null = null;
  @Input() previewUrl: any;
  @Input() document: any;

  gridData: any[] = [];
  columnDefs: any[] = [];

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };
selectedWorkflow = 'draft';
selectedStatus = 'pending';
  // 🔥 EVENTS
  @Output() viewChange =
    new EventEmitter<'metadata' | 'comments'>();
className: string = '';
id: any;
version: any;
DName: string = '';
createdDate: any;
createdBy: any;
modifiedDate: any;
modifiedBy: any;
  // 🔥 COMMENTS
  comments: any[] = [
    {
      user: 'Admin',
      text: 'Document reviewed',
      time: '10:30 AM'
    },
    {
      user: 'User1',
      text: 'Please update page 2',
      time: '11:00 AM'
    }
  ];

  newComment = '';

  // 🔥 CHANGE TAB
  changeView(view: 'metadata' | 'comments') {

    this.activeView = view;

    this.viewChange.emit(view);
  }

  // 🔥 ADD COMMENT
  addComment() {

    if (!this.newComment.trim()) return;

    this.comments.push({
      user: 'Me',
      text: this.newComment,
      time: new Date().toLocaleTimeString()
    });

    this.newComment = '';
  }
toggleMetaComment() {

  this.activeView =
    this.activeView === 'metadata'
      ? 'comments'
      : 'metadata';

  this.viewChange.emit(this.activeView);
}
  ngOnChanges(changes: SimpleChanges): void {

  if (changes['document'] && this.document) {

    this.generateMetadata();
  }
  
}
// =========================
  // CSV LOAD
  // =========================
  loadCsvFromBlob(blob: Blob) {
debugger
    const reader = new FileReader();

    reader.onload = (e: any) => {

      const text = e.target.result;

      const rows = text
  .split('\n')
  .map((r: string) => r.trim())
  .filter((r: string) => r.length > 0)
  .map((r: string) => r.split(','));

      this.buildGrid(rows);
    };

    reader.readAsText(blob);
  }

  // =========================
  // EXCEL LOAD
  // =========================
  loadExcelFromBlob(blob: Blob) {
debugger
    const reader = new FileReader();

    reader.onload = (e: any) => {

      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];

      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      this.buildGrid(rows);
    };

    reader.readAsArrayBuffer(blob);
  }

  // =========================
  // COMMON GRID BUILDER
  // =========================
  buildGrid(rows: any[][]) {

    if (!rows || rows.length === 0) return;

    const headers = rows[0];

    this.columnDefs = headers.map(h => ({
      field: h,
      headerName: h
    }));

    this.gridData = rows.slice(1).map(row => {

      const obj: any = {};

      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
console.log("CSV ROWS:", this.gridData);
console.log("COLUMNS:", this.columnDefs);
      return obj;
    });
  }
generateMetadata() {
  this.metadataFields = [];

  Object.keys(this.document).forEach(key => {

    const value = this.document[key];

    const field = {
      key: key,
      label: this.formatLabel(key),
      value: value
    };
    this.metadataFields.push(field);

    // 🔥 mapping logic
    switch (key.toLowerCase()) {

      case 'classname':
      case 'class_name':
        this.className = value;
        break;

      case 'id':
      case 'documentid':
        this.id = value;
        break;

      case 'name':
        this.DName = value;
        break;

      case 'version':
        this.version = value;
        break;

      case 'createddate':
      case 'created_date':
        this.createdDate = value;
        break;

      case 'createdby':
      case 'created_by':
        this.createdBy = value;
        break;

      case 'modifieddate':
      case 'modified_date':
        this.modifiedDate = value;
        break;

      case 'modifiedby':
      case 'modified_by':
        this.modifiedBy = value;
        break;
    }

  });
}
formatLabel(key: string): string {

  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}
}