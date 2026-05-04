import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent {

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

  isDashboard(): boolean {
    return this.router.url.includes('dashboard');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
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

          const mapped = data.map(item => ({
            name: item.odM_Nname,
            documentId: item.odM_DocumentID,
            documentName: item.odM_Nname,
            ext: item.odM_DocumentExt,
            status: item.odM_DocVersion_Latest,
            checkoutDate: item.odM_CheckoutDate,
            checkinDate: item.odM_CheckoutDate,
            version: item.odM_DocVersion_Latest,
            createdBy: item.odM_CreateBy,
            createdDate: item.odM_CreateDate
          }));

          this.documentService.setDocuments(mapped);
        },
        error: (err) => console.error(err)
      });
  }
}