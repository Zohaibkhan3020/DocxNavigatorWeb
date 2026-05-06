import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DocumentService } from '../services/document.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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

  forkJoin({
    assignments: this.ds.getAssignments(userId),
    favorites: this.ds.getFavorites(userId),
    recent: this.ds.getRecent(username)
  }).subscribe({
    next: (res) => {
      this.assignments = res.assignments;
      this.favorites = res.favorites;
      this.recent = res.recent;

      this.updateCards(); 
      this.applySavedOrder();
    },
    error: (err) => {
      console.error('Dashboard Load Error:', err);
    }
  });
}
drop(event: CdkDragDrop<any[]>) {
  moveItemInArray(this.cards, event.previousIndex, event.currentIndex);

  // ✅ save order
  this.saveCardOrder();
}

saveCardOrder() {
  const order = this.cards.map((c, index) => ({
    title: c.title,
    order: index
  }));

  localStorage.setItem('cardOrder', JSON.stringify(order));
}
applySavedOrder() {
  const saved = localStorage.getItem('cardOrder');
  if (!saved) return;

  const order = JSON.parse(saved);

  this.cards.sort((a, b) => {
    const aOrder = order.find((x: any) => x.title === a.title)?.order ?? 999;
    const bOrder = order.find((x: any) => x.title === b.title)?.order ?? 999;
    return aOrder - bOrder;
  });
}
  // 🔥 CENTRAL CARD BUILDER
  updateCards() {
  this.cards = [
    {
      title: 'Assignments',
      icon: 'description',
      count: this.assignments?.length || 0,
      list: this.assignments
    },
    {
      title: 'Favorites',
      icon: 'star',
      count: this.favorites?.length || 0,
      list: this.favorites
    },
    {
      title: 'Recent',
      icon: 'history',
      count: this.recent?.length || 0,
      list: this.recent
    },
    {
  title: 'Reports',
  icon: 'bar_chart',
  list: [{ label:'Daily Activity'}, {label: 'Uploads'}, {label: 'Downloads'}]
},
    {
      title: 'Workspace',
      icon: 'workspaces',
      list: [
        { label: 'Module 1', value: '70%' },
        { label: 'Module 2', value: '30%' },
        { label: 'Module 3', value: 'Available' }
      ]
    },
    {
      title: 'Storage',
      icon: 'storage',
      list: [
        { label: 'Used Space', value: '120 GB' },
        { label: 'Free Space', value: '80 GB' },
        { label: 'Backup', value: 'Last Night' }
      ]
    },
    {
      title: 'Modules',
      icon: 'view_module',
      list: [
        { label: 'Module 1', value: '70%' },
        { label: 'Module 2', value: '30%' },
        { label: 'Module 3', value: 'Available' }
      ]
    },
    {
      title: 'Activity Log',
      icon: 'history',
      list: [
        { label: 'Recent Activity', value: '120 GB' },
        { label: 'System Updates', value: '80 GB' },
        { label: 'Security Alerts', value: 'Last Night' }
      ]
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