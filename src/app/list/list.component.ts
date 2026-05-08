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

// selectRow(row: any) {
//   this.rowSelected.emit(row);
// }
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

  this.allColumns = Object.keys(data[0]);

  this.displayedColumns = [...this.allColumns];
}
dropColumn(event: CdkDragDrop<string[]>) {

  moveItemInArray(
    this.displayedColumns,
    event.previousIndex,
    event.currentIndex
  );

  this.displayedColumns = [...this.displayedColumns];
}
hideColumn(column: string) {

  this.displayedColumns =
    this.displayedColumns.filter(c => c !== column);

  this.hiddenColumns.push(column);
}
showColumn(event: any) {

  const column = event.target.value;

  if (!column) return;

  if (!this.displayedColumns.includes(column)) {
    this.displayedColumns.push(column);
  }

  this.hiddenColumns =
    this.hiddenColumns.filter(c => c !== column);
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
  } else {
    this._liveAnnouncer.announce('Sorting cleared');
  }
}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  selectRow(row: any) {
    localStorage.setItem('selectedNode', row.cardid);
  this.documentService.setSelectedDoc(row);
  console.log("check : " +row)

}
}