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

  isSidebarOpened = true;

  leftWidth = 240;

  rightWidth = 400;

  metaWidth = 350;

  // 🔥 PREVIEW PANEL
  previewOpen = false;

  // 🔥 INFO PANEL
  infoPanelOpen = false;

  infoView: 'metadata' | 'comments' = 'metadata';

  selectedDoc: any = null;

  fileType: 'pdf' | 'excel' | null = null;

  previewUrl: any;

  constructor(
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit() {

    this.documentService.breadcrumb$
      .subscribe(data => {
        this.breadcrumb = data;
      });

    this.documentService.selectedDoc$
      .subscribe(doc => {

        if (!doc) return;

        this.selectedDoc = doc;

        const ext = doc.ext?.toLowerCase();

        if (ext === 'pdf') {
          this.fileType = 'pdf';
        }
        else if (ext === 'xls' || ext === 'xlsx') {
          this.fileType = 'excel';
        }
        else {
          this.fileType = null;
        }

        const cardId = Number(localStorage.getItem('selectedNode'));

        this.documentService
          .openDocument(doc.documentId, cardId, 1)
          .subscribe(blob => {

            if (this.previewUrl) {
              URL.revokeObjectURL(this.previewUrl);
            }

            this.previewUrl = URL.createObjectURL(blob);

            // 🔥 AUTO OPEN PREVIEW
            this.previewOpen = true;
          });

      });
  }

  // ---------------- PREVIEW ----------------

  togglePreview() {
    this.previewOpen = !this.previewOpen;
  }

  // ---------------- INFO PANEL ----------------

  openInfoPanel(view: 'metadata' | 'comments') {

    this.infoView = view;

    this.infoPanelOpen = !this.infoPanelOpen;
  }

  setInfoView(view: 'metadata' | 'comments') {
    this.infoView = view;

    this.infoPanelOpen = true;
  }

  // ---------------- NAVIGATION ----------------

  navigate(node: any) {

    if (node.route) {
      this.router.navigate([node.route]);
    }

    if (node.breadcrumb) {
      this.breadcrumb = node.breadcrumb;
    }
  }

  // ---------------- SIDEBAR ----------------

  toggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
  }

  // ---------------- LOGOUT ----------------

  logout() {

    localStorage.clear();

    this.router.navigate(['/login']);
  }

  // ---------------- RIGHT RESIZE ----------------

  private isResizing = false;

  private startX = 0;

  private startWidth = 0;

  startResize(event: MouseEvent) {

  this.isResizing = true;

  this.startX = event.clientX;

  // 🔥 detect active panel
  if (this.previewOpen) {
    this.startWidth = this.rightWidth;
  }
  else if (this.infoPanelOpen) {
    this.startWidth = this.metaWidth;
  }

  document.addEventListener('mousemove', this.onMouseMove);

  document.addEventListener('mouseup', this.stopResize);
}

 onMouseMove = (event: MouseEvent) => {

  if (!this.isResizing) return;

  const diff = this.startX - event.clientX;

  // 🔥 PREVIEW PANEL
  if (this.previewOpen) {

    this.rightWidth = this.startWidth + diff;

    if (this.rightWidth < 250) {
      this.rightWidth = 250;
    }

    if (this.rightWidth > 900) {
      this.rightWidth = 900;
    }
  }

  // 🔥 INFO PANEL
  else if (this.infoPanelOpen) {

    this.metaWidth = this.startWidth + diff;

    if (this.metaWidth < 250) {
      this.metaWidth = 250;
    }

    if (this.metaWidth > 700) {
      this.metaWidth = 700;
    }
  }
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

    if (this.leftWidth < 180) {
      this.leftWidth = 180;
    }

    if (this.leftWidth > 450) {
      this.leftWidth = 450;
    }
  };

  stopLeftResize = () => {

    this.isLeftResizing = false;

    document.removeEventListener('mousemove', this.onLeftMove);

    document.removeEventListener('mouseup', this.stopLeftResize);
  };
}