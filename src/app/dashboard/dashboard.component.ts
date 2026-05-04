import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DocumentService } from '../services/document.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // ✅ FIXED
  standalone: false
})
export class DashboardComponent implements OnInit {

  isSidebarOpened = true;

  assignments: any[] = [];
  favorites: any[] = [];
  recent: any[] = [];

  userName: string = '';

  title = "DOCX Navigator";

  // ✅ empty init (IMPORTANT FIX)
  cards: any[] = [];

  displayedColumns: string[] = ['name', 'type', 'date', 'action'];

  documents = [
    { name: 'File1.pdf', type: 'PDF', date: '2026-04-20' },
    { name: 'Report.docx', type: 'Word', date: '2026-04-18' },
    { name: 'Image.png', type: 'Image', date: '2026-04-15' }
  ];

  constructor(
    private ds: DashboardService,
    private nav: DocumentService,
    private router: Router
  ) {}

  ngOnInit() {

    const userId = Number(localStorage.getItem('id') || 0);
    const username = localStorage.getItem('username') || '';
    this.userName = username;

    // 🔥 Assignments API
    this.ds.getAssignments(userId).subscribe(res => {
      this.assignments = res;
      this.updateCards(); // ✅ update after data
    });

    this.ds.getFavorites(userId).subscribe(res => {
      this.favorites = res;
      this.updateCards();
    });

    this.ds.getRecent(username).subscribe(res => {
      this.recent = res;
      this.updateCards();
    });
  }

  // 🔥 CENTRAL CARD BUILDER
  updateCards() {
    this.cards = [
      {
        title: 'Assignments',
        icon: 'description',
        list: this.assignments
      },
      {
        title: 'Favorites',
        icon: 'star',
        list: this.favorites
      },
      {
        title: 'Recent',
        icon: 'history',
        list: this.recent
      },
      {
        title: 'Storage',
        icon: 'storage',
        list: ['Used Space', 'Free Space', 'Backup']
      }
    ];
  }
OpenContent(item: any)
{ 
  debugger
  const cardId = item.cardID; 
if (!cardId) return; 
this.nav.setSelectedNode(cardId); 
this.router.navigate(['/content'], 
  { 
    queryParams: { id: cardId } }); 
  this.router.navigate(['/list']); 
} 
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']); // optional fix
  }

  toggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
  }
}