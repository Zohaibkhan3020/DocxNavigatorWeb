import { Component, OnInit, OnDestroy, ViewChild, inject, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { DocumentService } from '../services/document.service';
import { Subscription } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: false
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
@Output() rowSelected = new EventEmitter<any>();

selectedRow: any = null;
  private _liveAnnouncer = inject(LiveAnnouncer);
allColumns: string[] = [];
displayedColumns: string[] = [];
hiddenColumns: string[] = [];
  
  dataSource = new MatTableDataSource<any>([]);
  private sub!: Subscription;

 @ViewChild(MatSort) sort!: MatSort;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.sub = this.documentService.documents$.subscribe(data => {

    if (!data) return;

    this.setGridData(data);
  });
  const savedColumns = localStorage.getItem('grid-columns');

if (savedColumns) {
  this.displayedColumns = JSON.parse(savedColumns);
}
  }
buildColumns(data: any[]) {

  if (!data || data.length === 0) return;

  // ALL DB COLUMNS
  this.allColumns = Object.keys(data[0]);

  // SAVED VISIBLE
  const savedVisible =
    localStorage.getItem('grid-columns');

  // SAVED HIDDEN
  const savedHidden =
    localStorage.getItem('hidden-columns');

  this.hiddenColumns = savedHidden
    ? JSON.parse(savedHidden)
    : [];

  // FIRST TIME
  if (!savedVisible) {

    this.displayedColumns =
      this.allColumns.filter(
        col => !this.hiddenColumns.includes(col)
      );

    return;
  }

  const parsedVisible = JSON.parse(savedVisible);

  // RESTORE ONLY EXISTING COLUMNS
  this.displayedColumns =
    parsedVisible.filter((c: string) =>
      this.allColumns.includes(c)
    );

  // AUTO ADD NEW DB COLUMNS
  this.allColumns.forEach(col => {

    const exists =
      this.displayedColumns.includes(col);

    const hidden =
      this.hiddenColumns.includes(col);

    // ONLY NEW & NOT HIDDEN
    if (!exists && !hidden) {
      this.displayedColumns.push(col);
    }

  });
}
dropColumn(event: CdkDragDrop<string[]>) {

  moveItemInArray(
    this.displayedColumns,
    event.previousIndex,
    event.currentIndex
  );

  this.displayedColumns = [...this.displayedColumns];

  localStorage.setItem(
    'grid-columns',
    JSON.stringify(this.displayedColumns)
  );
}
toggleColumn(column: string, checked: boolean) {

  if (checked) {

    // SHOW
    if (!this.displayedColumns.includes(column)) {
      this.displayedColumns.push(column);
    }

    this.hiddenColumns =
      this.hiddenColumns.filter(c => c !== column);

  } else {

    // HIDE
    this.displayedColumns =
      this.displayedColumns.filter(c => c !== column);

    if (!this.hiddenColumns.includes(column)) {
      this.hiddenColumns.push(column);
    }
  }

  // SAVE
  localStorage.setItem(
    'grid-columns',
    JSON.stringify(this.displayedColumns)
  );

  localStorage.setItem(
    'hidden-columns',
    JSON.stringify(this.hiddenColumns)
  );
}


setGridData(data: any[]) {
  this.dataSource.data = data || [];
  this.buildColumns(data);
}
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: any) {
    const state = sortState as Sort;
      if (state.direction) {
        this._liveAnnouncer.announce(`Sorted ${state.direction}ending`);
      } 
      else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

 selectRow(row: any) {
  this.selectedRow = row;
  localStorage.setItem('selectedNode', row.cardid);
  this.documentService.setSelectedNode(row.cardid);
  this.documentService.setSelectedDoc(row);
  }
}