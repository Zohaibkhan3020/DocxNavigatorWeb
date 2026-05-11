import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {
themeMode: 'light' | 'dark' | 'system' = 'system';
  @Input() title!: string;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();

  searchText: string = '';
  isDarkMode = false;

  // 🔥 FILTER OBJECT
  filters = {
    type: '',
    date: '',
    user: ''
  };

  constructor(
    private router: Router,
    private documentService: DocumentService
  ) {}
ngOnInit() {
  const savedTheme = localStorage.getItem('theme') as any;
  this.themeMode = savedTheme || 'system';
  this.applyTheme();
}
  isDashboard(): boolean {
    return this.router.url.includes('dashboard');
  }

  // 🔥 Toggle button (cycle modes)
toggleDarkMode() {
  if (this.themeMode === 'light') {
    this.themeMode = 'dark';
  } else if (this.themeMode === 'dark') {
    this.themeMode = 'system';
  } else {
    this.themeMode = 'light';
  }

  localStorage.setItem('theme', this.themeMode);
  this.applyTheme();
}

// 🔥 Apply Theme Logic
applyTheme() {
  const body = document.body;

  body.classList.remove('light-mode', 'dark-mode');

  if (this.themeMode === 'dark') {
    body.classList.add('dark-mode');
  } else if (this.themeMode === 'light') {
    body.classList.add('light-mode');
  } else {
    // 🔥 SYSTEM MODE
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersDark) {
      body.classList.add('dark-mode');
    } else {
      body.classList.add('light-mode');
    }
  }
}

  // 🔍 NORMAL SEARCH
  onSearch() {
    this.searchDocuments();
  }

  // 🔥 FILTER SEARCH
  applyFilters() {
    this.searchDocuments();
  }

  // 🔥 COMMON METHOD
  private searchDocuments() {

  const userId = Number(localStorage.getItem('id'));
  const roleId = Number(localStorage.getItem('RoleID'));

  if (!this.searchText || this.searchText.trim() === '') return;

  this.documentService
    .SearchDocuments(userId, roleId, this.searchText, this.filters)
    .subscribe({

      next: (data) => {

        const mapped = data.map((item: any) => {

          // ✅ DynamicJson Parse
          let dynamicFields = {};

          try {
            dynamicFields = item.dynamicJson ? JSON.parse(item.dynamicJson) : {};
          }
          catch (e) {
            console.error('DynamicJson Parse Error', e);
          }

          return {
            // ✅ DYNAMIC COLUMNS
            ...dynamicFields,
            // STATIC FIELDS
            cardid: item.cardID,
            folderID: item.folderID,
            name: item.odM_Nname,
            documentId: item.odM_DocumentID,
            ext: item.odM_DocumentExt,
            status: item.odM_DocVersion_Latest,
            checkoutDate: item.odM_CheckoutDate,
            checkinDate: item.odM_CheckoutDate,
            version: item.odM_DocVersion_Latest,
            createdBy: item.odM_CreateBy,
            createdDate: item.odM_CreateDate

          };
        });

        console.log(mapped);

        this.documentService.setDocuments(mapped);
      },

      error: (err) => console.error(err)
    });
}
}