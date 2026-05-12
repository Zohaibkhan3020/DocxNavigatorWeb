import {
  Component, OnInit, OnDestroy, ViewChild, inject,
  AfterViewInit, Output, EventEmitter
} from '@angular/core';

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

export class ListComponent implements OnInit, AfterViewInit, OnDestroy {

  // =========================================================
  // OUTPUT EVENT (Parent ko selected row bhejna ho)
  // =========================================================
  @Output() rowSelected = new EventEmitter<any>();

  // =========================================================
  // SELECTED ROW STATE
  // =========================================================
  selectedRow: any = null;

  // =========================================================
  // LIVE ANNOUNCER (Accessibility - sorting announcements)
  // =========================================================
  private _liveAnnouncer = inject(LiveAnnouncer);

  // =========================================================
  // TABLE COLUMNS STATE
  // =========================================================
  allColumns: string[] = [];        // DB se saari columns
  displayedColumns: string[] = [];  // jo UI me show ho rahi hain
  hiddenColumns: string[] = [];     // hide ki hui columns

  // =========================================================
  // COLUMN RESIZE STATE
  // =========================================================
  columnWidths: { [key: string]: number } = {}; // per column width

  private resizingColumn!: string; // currently resizing column
  private startX!: number;         // mouse start position
  private startWidth!: number;     // initial column width

  // =========================================================
  // TABLE DATA SOURCE
  // =========================================================
  dataSource = new MatTableDataSource<any>([]);
  private sub!: Subscription;

  // =========================================================
  // ANGULAR MATERIAL SORT
  // =========================================================
  @ViewChild(MatSort) sort!: MatSort;

  // =========================================================
  // CONSTRUCTOR - SERVICE INJECTION
  // =========================================================
  constructor(private documentService: DocumentService) {}

  // =========================================================
  // INIT - DATA SUBSCRIPTION + LOCAL STORAGE RESTORE
  // =========================================================
  ngOnInit(): void {

    // Subscribe to document stream (API / service data)
    this.sub = this.documentService.documents$.subscribe(data => {
      if (!data) return;
      this.setGridData(data);
    });

    // Restore saved column order from localStorage
    const savedColumns = localStorage.getItem('grid-columns');
    if (savedColumns) {
      this.displayedColumns = JSON.parse(savedColumns);
    }

    // Restore saved column widths
    const savedWidths = localStorage.getItem('column-widths');
    if (savedWidths) {
      this.columnWidths = JSON.parse(savedWidths);
    }
  }

  // =========================================================
  // BUILD COLUMNS (Dynamic DB columns + saved preferences)
  // =========================================================
  buildColumns(data: any[]) {

    if (!data || data.length === 0) return;

    // Step 1: Extract DB columns
    this.allColumns = Object.keys(data[0]);

    // Step 2: Load saved hidden columns
    const savedHidden = localStorage.getItem('hidden-columns');
    this.hiddenColumns = savedHidden ? JSON.parse(savedHidden) : [];

    // Step 3: First time setup (no saved config)
    const savedVisible = localStorage.getItem('grid-columns');

    if (!savedVisible) {

      this.displayedColumns =
        this.allColumns.filter(col => !this.hiddenColumns.includes(col));

      return;
    }

    // Step 4: Restore saved visible columns
    const parsedVisible = JSON.parse(savedVisible);

    this.displayedColumns =
      parsedVisible.filter((c: string) => this.allColumns.includes(c));

    // Step 5: Auto-add new DB columns (not hidden)
    this.allColumns.forEach(col => {

      const exists = this.displayedColumns.includes(col);
      const hidden = this.hiddenColumns.includes(col);

      if (!exists && !hidden) {
        this.displayedColumns.push(col);
      }

    });
  }

  // =========================================================
  // SET TABLE DATA
  // =========================================================
  setGridData(data: any[]) {
  this.dataSource = new MatTableDataSource(data || []);
  this.buildColumns(data);

  // re-attach sort after new datasource
  setTimeout(() => {
    this.dataSource.sort = this.sort;
  });
}

  // =========================================================
  // COLUMN DRAG & DROP (Reorder columns)
  // =========================================================
  dropColumn(event: CdkDragDrop<string[]>) {

    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );

    this.displayedColumns = [...this.displayedColumns];

    // Save order
    localStorage.setItem(
      'grid-columns',
      JSON.stringify(this.displayedColumns)
    );
  }

  // =========================================================
  // SHOW / HIDE COLUMN TOGGLE
  // =========================================================
  toggleColumn(column: string, checked: boolean) {

    if (checked) {

      // SHOW COLUMN
      if (!this.displayedColumns.includes(column)) {
        this.displayedColumns.push(column);
      }

      this.hiddenColumns =
        this.hiddenColumns.filter(c => c !== column);

    } else {

      // HIDE COLUMN
      this.displayedColumns =
        this.displayedColumns.filter(c => c !== column);

      if (!this.hiddenColumns.includes(column)) {
        this.hiddenColumns.push(column);
      }
    }

    // SAVE STATE
    localStorage.setItem(
      'grid-columns',
      JSON.stringify(this.displayedColumns)
    );

    localStorage.setItem(
      'hidden-columns',
      JSON.stringify(this.hiddenColumns)
    );
  }

  // =========================================================
  // SORTING INITIALIZATION
  // =========================================================
  ngAfterViewInit(): void {

  setTimeout(() => {

    this.dataSource.sort = this.sort;

    // IMPORTANT: force refresh
    this.dataSource.data = [...this.dataSource.data];

  });

}

  // =========================================================
  // SORT ANNOUNCEMENT (Accessibility)
  // =========================================================
  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(
        `Sorted ${sortState.direction}ending`
      );
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // =========================================================
  // ROW SELECTION (Double click)
  // =========================================================
  selectRow(row: any) {

    this.selectedRow = row;

    localStorage.setItem('selectedNode', row.cardid);

    this.documentService.setSelectedNode(row.cardid);
    this.documentService.setSelectedDoc(row);
  }

  // =========================================================
  // COLUMN RESIZE START
  // =========================================================
  startResize(event: MouseEvent, column: string) {

  event.preventDefault();
  event.stopPropagation();

  this.resizingColumn = column;

  this.startX = event.pageX;
  this.startWidth = this.columnWidths[column] || 120;

  document.addEventListener('mousemove', this.onResizeMove);
  document.addEventListener('mouseup', this.onResizeEnd);
}

  // =========================================================
  // COLUMN RESIZE MOVE
  // =========================================================
  onResizeMove = (event: MouseEvent) => {

  const offset = event.pageX - this.startX;
  const newWidth = this.startWidth + offset;

  if (newWidth > 60) {
    this.columnWidths[this.resizingColumn] = newWidth;
  }
}

onResizeEnd = () => {

  localStorage.setItem(
    'column-widths',
    JSON.stringify(this.columnWidths)
  );

  document.removeEventListener('mousemove', this.onResizeMove);
  document.removeEventListener('mouseup', this.onResizeEnd);
}

  // =========================================================
  // CLEANUP
  // =========================================================
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}