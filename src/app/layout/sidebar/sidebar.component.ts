import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MenuService } from 'src/app/services/menu.service';
import { DocumentService } from 'src/app/services/document.service';
import { Router } from '@angular/router';

interface TreeNode {
  id: number;
  name: string;
  icon: string;
  type: string;
  route?: string;
  breadcrumb?: string[];
  children?: TreeNode[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: false
})
export class SidebarComponent implements OnInit {
  selectedNodeId: number | null = null;
  @Output() navigateEvent = new EventEmitter<any>();
  constructor(private menuService: MenuService, private documentService: DocumentService, 
    private router: Router) {}

  ngOnInit() {
   const userId = Number(localStorage.getItem('id'));
    const roleId = Number(localStorage.getItem('RoleID'));

    this.menuService.getMenu(roleId, userId).subscribe({
      next: (data) => {
        // 🔥 map backend data → UI format
        const tree = this.mapTree(data, []);
        this.dataSource.data = tree;
      },
      error: (err) => console.error(err)
    });
  }

  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable
  );

  private transformer = (node: TreeNode, level: number) => {
    return {
      id: node.id,
      name: node.name,
      icon: node.icon,
      route: node.route,
      type: node.type,
      breadcrumb: node.breadcrumb,
      level: level,
      expandable: !!node.children?.length
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

  mapTree(data: any[], parentBreadcrumb: string[]): TreeNode[] {
    return data.map(item => {
      const currentBreadcrumb = [...parentBreadcrumb, item.name];

      return {
        id: item.id,
        name: item.name,
        type: item.type,
        icon: this.getIcon(item.type),
        route: item.route || null,
        breadcrumb: currentBreadcrumb,
        children: item.children?.length
  ? this.mapTree(item.children, currentBreadcrumb)
  : []
      };
    });
  }

  // =========================
  // ICON SET
  // =========================
  getIcon(type: string): string {
    switch (type) {
      case 'Library': return 'dns';
      case 'Folder': return 'folder_open';
      case 'Card': return 'description';
      default: return 'insert_drive_file';
    }
  }

  navigate(node: TreeNode) {
    this.selectedNodeId = node.id;
    localStorage.setItem('selectedNode', node.id.toString());
  // 👉 breadcrumb set karo
  this.documentService.setBreadcrumb(node.breadcrumb || []);

  // ❌ parent pe API call mat karo
   if (node.type !== 'Card') {
    this.navigateEvent.emit(node);
    return;
  }

  const userId = Number(localStorage.getItem('id'));
  const cardId = node.id;

  this.documentService.getDocuments(userId, cardId).subscribe({
    next: (data) => {
debugger;
      const mapped = data.map((item: any) => {

  let dynamicFields = {};

  try {
    dynamicFields = item.dynamicJson
      ? JSON.parse(item.dynamicJson)
      : {};
  }
  catch (e) {
    console.error('DynamicJson Parse Error', e);
  }

  return {

    // ✅ Dynamic Fields
    ...dynamicFields,
    cardid: item.cardID,
    folderID: item.folderID,
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

  };
});
      this.documentService.setDocuments(mapped);

      // async emit (safe)
      setTimeout(() => {
        this.navigateEvent.emit(node);
      });
    },
    error: (err) => console.error(err)
  });
}

clickLogo(){
  this.router.navigate(['/dashboard']);
}
}