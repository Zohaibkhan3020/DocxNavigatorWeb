import { Component, OnInit, OnDestroy, ViewChild, inject, AfterViewInit } from '@angular/core';
import { DocumentService } from '../services/document.service';
import { Subscription } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: false
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {

  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = [
    'name',
    'documentId',
    'documentName',
    'ext',
    'status',
    'checkoutDate',
    'checkinDate',
    'version',
    'createdBy',
    'createdDate'
  ];

  dataSource = new MatTableDataSource<any>([]);
  private sub!: Subscription;

 @ViewChild(MatSort) sort!: MatSort;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.sub = this.documentService.documents$.subscribe(data => {
      this.dataSource.data = data || [];
    });
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
}