import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface TreeNode {
  name: string;
  icon: string;
  route?: string;
  breadcrumb?: string[];
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    breadcrumb: ['Dashboard']
  },
  {
    name: 'Users',
    icon: 'group',
    breadcrumb: ['Users'],
    children: [
      { name: 'Add User', icon: 'person_add', route: '/users/add', breadcrumb: ['Users', 'Add User'] },
      { name: 'User List', icon: 'list', route: '/users', breadcrumb: ['Users', 'User List'] }
    ]
  },
  {
    name: 'Settings',
    icon: 'settings',
    breadcrumb: ['Settings'],
    children: [
      { name: 'Profile', icon: 'person', route: '/profile', breadcrumb: ['Settings', 'Profile'] },
      { name: 'Security', icon: 'lock', route: '/security', breadcrumb: ['Settings', 'Security'] }
    ]
  }
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {

  title = "DOCX Navigator";

  breadcrumb: string[] = ['Dashboard'];

  isMobile = false;
  isSidebarOpened = true;

  constructor(private router: Router) {
    this.dataSource.data = TREE_DATA;
  }
activeView: 'preview' | 'metadata' = 'preview';

setView(view: 'preview' | 'metadata') {
  this.activeView = view;
}
  // ---------------- RESPONSIVE ----------------
  @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
    this.isSidebarOpened = !this.isMobile;
  }

  toggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
  }

  // ---------------- TREE ----------------
  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable
  );

  private transformer = (node: TreeNode, level: number) => {
    return {
      name: node.name,
      icon: node.icon,
      route: node.route,
      breadcrumb: node.breadcrumb,
      level: level,
      expandable: !!node.children
    };
  };

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: any) => node.expandable;

  // ---------------- NAVIGATION ----------------
  navigate(node: any) {
    if (node.route) {
      this.router.navigate([node.route]);
    }

    if (node.breadcrumb) {
      this.breadcrumb = [...node.breadcrumb];
    }
  }

  // ---------------- LOGOUT ----------------
  logout() {
    localStorage.clear();
    console.log("Logged out");
    this.router.navigate(['/login']);
  }
  rightWidth = 320;

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

  // limits
  if (this.rightWidth < 200) this.rightWidth = 200;
  if (this.rightWidth > 600) this.rightWidth = 600;
};

stopResize = () => {
  this.isResizing = false;
  document.removeEventListener('mousemove', this.onMouseMove);
  document.removeEventListener('mouseup', this.stopResize);
};
leftWidth = 240;

private isLeftResizing = false;
private leftStartX = 0;
private leftStartWidth = 0;

// START LEFT RESIZE
startLeftResize(event: MouseEvent) {
  this.isLeftResizing = true;
  this.leftStartX = event.clientX;
  this.leftStartWidth = this.leftWidth;

  document.addEventListener('mousemove', this.onLeftMouseMove);
  document.addEventListener('mouseup', this.stopLeftResize);
}

// MOVE
onLeftMouseMove = (event: MouseEvent) => {
  if (!this.isLeftResizing) return;

  const diff = event.clientX - this.leftStartX;
  this.leftWidth = this.leftStartWidth + diff;

  // limits
  if (this.leftWidth < 180) this.leftWidth = 180;
  if (this.leftWidth > 400) this.leftWidth = 400;
};

// STOP
stopLeftResize = () => {
  this.isLeftResizing = false;
  document.removeEventListener('mousemove', this.onLeftMouseMove);
  document.removeEventListener('mouseup', this.stopLeftResize);
};
}