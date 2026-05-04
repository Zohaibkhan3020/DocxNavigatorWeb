import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.css'],
    standalone: false
})
export class MainLayoutComponent {

  title = "DOCX Navigator";
  breadcrumb: string[] = [];
documents: any[] = [];
  isSidebarOpened = true;
rightPanelOpen = false;
   leftWidth = 240;
  rightWidth = 320;

  activeView: 'preview' | 'metadata' = 'preview';

selectedDoc: any = null;
fileType: 'pdf' | 'excel' | null = null;

constructor(private router: Router, private documentService: DocumentService) {}
ngOnInit() {
 this.documentService.breadcrumb$.subscribe(data => {
    this.breadcrumb = data;
  });
}
openDocument(doc: any) {
  this.selectedDoc = doc;
  this.fileType = doc.type;
  this.activeView = 'preview';

  this.rightPanelOpen = true;   // ✅ ADD THIS
}


navigate(node: any) {
debugger  
  if (node.route) {
    this.router.navigate([node.route]);
  }

  if (node.breadcrumb) {
    this.breadcrumb = node.breadcrumb;
  }
}
  // sidebar toggle
  toggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
  }
toggleRightPanel() {
  this.rightPanelOpen = !this.rightPanelOpen;
}
  // navigation
//   navigate(node: any) {

//   if (node.route) {
//     // this.router.navigate([node.route]); (optional)
//   }

//   if (node.breadcrumb) {
//     this.breadcrumb = [...node.breadcrumb];
//   }

//   // 🔥 NEW: file type assign (dummy logic)
//   if (node.name.toLowerCase().includes('user')) {
//     this.fileType = 'excel';
//   }
//   else if (node.name.toLowerCase().includes('dashboard')) {
//     this.fileType = 'pdf';
//   }
//   else {
//     this.fileType = null;
//   }
// }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

setView(view: 'preview' | 'metadata') {
  this.activeView = view;
}
  // ---------------- RIGHT RESIZE ----------------
  private isResizing = false;
  private startX = 0;
  private startWidth = 0;

  startResize(event: MouseEvent) {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = this.rightWidth;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.stopResize);
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.isResizing) return;

    const diff = this.startX - event.clientX;
    this.rightWidth = this.startWidth + diff;

    if (this.rightWidth < 200) this.rightWidth = 200;
    if (this.rightWidth > 600) this.rightWidth = 600;
  };

  stopResize = () => {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.stopResize);
  };

  // ---------------- LEFT RESIZE ----------------
  private isLeftResizing = false;
  private leftStartX = 0;
  private leftStartWidth = 0;

  startLeftResize(event: MouseEvent) {
    this.isLeftResizing = true;
    this.leftStartX = event.clientX;
    this.leftStartWidth = this.leftWidth;

    document.addEventListener('mousemove', this.onLeftMove);
    document.addEventListener('mouseup', this.stopLeftResize);
  }

  onLeftMove = (event: MouseEvent) => {
    if (!this.isLeftResizing) return;

    const diff = event.clientX - this.leftStartX;
    this.leftWidth = this.leftStartWidth + diff;

    if (this.leftWidth < 180) this.leftWidth = 180;
    if (this.leftWidth > 400) this.leftWidth = 400;
  };

  stopLeftResize = () => {
    this.isLeftResizing = false;
    document.removeEventListener('mousemove', this.onLeftMove);
    document.removeEventListener('mouseup', this.stopLeftResize);
  };
}
