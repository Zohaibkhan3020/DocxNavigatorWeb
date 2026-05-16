import { Component, EventEmitter, Output, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MenuService } from 'src/app/services/menu.service';
import { DocumentService } from 'src/app/services/document.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { FolderService } from 'src/app/services/folder.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateVaultDialogComponent } from 'src/app/shared/create-vault-dialog/create-vault-dialog.component';
import { ActionDialogComponent } from 'src/app/shared/action-dialog/action-dialog.component';
import { Title } from '@angular/platform-browser';
import { BinderdialogComponent } from 'src/app/shared/binderdialog/binderdialog.component';
interface TreeNode {
  id: number;
  name: string;
  icon: string;
  type: string;
  route?: string;
  breadcrumb?: string[];
  children?: TreeNode[];
}
export interface FolderDto {
  folderID: number;
  folderName: string;
  parentID: number;
  folderType: string;
  username: string;
  roleID: number;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: false
})
export class SidebarComponent implements OnInit, AfterViewInit {
  selectedNodeId: number | null = null;
private nodeMap = new Map<number, any>();

  @Output() navigateEvent = new EventEmitter<any>();
  constructor(private menuService: MenuService,
    private folderService: FolderService,
    private documentService: DocumentService, 
    private router: Router,
    private dialog: MatDialog) {}
    private selectedNodeSub!: Subscription;
 @ViewChild('menuTrigger', { read: MatMenuTrigger })
menuTrigger!: MatMenuTrigger;

menuX = 0;
menuY = 0;

contextNode: any;
  ngOnInit() {
     const savedNode =
    localStorage.getItem('selectedNode');

  if (savedNode) {
    this.selectedNodeId = Number(savedNode);
  }
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
   this.selectedNodeSub =
  this.selectedNodeSub =
  this.documentService.selectedNode$
    .subscribe(nodeId => {

      if (!nodeId) return;

      this.selectedNodeId = nodeId;

      setTimeout(() => {

        this.expandNodeById(nodeId);

      }, 200); // IMPORTANT delay

    });
  }
  expandNodeById(nodeId: number) {

    const nodes = this.treeControl.dataNodes || [];

    const target = nodes.find(x => x.id === nodeId);

    if (!target) return;

    // Expand only THIS node (safe)
    this.treeControl.expand(target);

  }
  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable
  );

private transformer = (node: TreeNode, level: number) => {

  const transformedNode = {

    id: node.id,
    name: node.name,
    icon: node.icon,
    route: node.route,
    type: node.type,
    breadcrumb: node.breadcrumb,
    level: level,
    expandable: !!node.children?.length

  };

  // SAVE NODE
  this.nodeMap.set(node.id, transformedNode);

  return transformedNode;
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
  openContextMenu(event: MouseEvent, node: any) {

    event.preventDefault();

    this.contextNode = node;

    this.menuX = event.clientX;
    this.menuY = event.clientY;

    setTimeout(() => {
      this.menuTrigger.openMenu();
    });
  }
  addFolder(node: any) {

  console.log('Add Folder:', node);

  // TODO:
  // open dialog
}

addCard(node: any) {

  console.log('Add Card:', node);

  // TODO:
  // open dialog
}
createVault(node: any, type: string) {
const userId = Number(localStorage.getItem('id'));
  const roleId = Number(localStorage.getItem('RoleID'));
  const username = localStorage.getItem('username');
  const dialogRef = this.dialog.open(ActionDialogComponent, {
    width: '450px',
    maxHeight: 'auto',
    panelClass: 'custom-dialog-container',
    disableClose: true,
    data: {
      
      mode: 'create',
      type: type === 'Folder' ? 'Drawer' : type,
      title: `Create New ${type === 'Folder' ? 'Drawer' : type}`,
    }
  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result)
      return;

    const payload = {

      folderID: 0,
      folderName: result.vaultName,
      parentID: node.id,
      folderType: type,
      username: username,
      roleID: roleId

    };

    this.folderService.createVault(payload).subscribe({
      next: (res) => {
        this.loadMenu(node);
      },
      error: (err) => {
        console.error(err);
      }

    });

  });
}
renameNode(node: any) {
const userId = Number(localStorage.getItem('id'));
  const roleId = Number(localStorage.getItem('RoleID'));
  const username = localStorage.getItem('username');
  const dialogRef = this.dialog.open(ActionDialogComponent, {
     width: '450px',
  maxHeight: 'auto',
  panelClass: 'custom-dialog-container',
  disableClose: true,
    data: {
      mode: 'rename',
      type: node.type,
      currentName: node.name,
       title: `Rename ${node.type === 'Folder' ? 'Drawer' : node.type}`
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    const payload = {
      id: node.id,
      name: result.vaultName,
      type: node.type,
      username: username
    };

    this.folderService.renameNode(payload).subscribe(() => {
      this.loadMenu(node);
    });

  });
}

showDeleted(node: any) {
  console.log('Show Deleted Documents', node);
}
restoreExpansion(nodeId: number) {

  const nodes = this.treeControl.dataNodes || [];

  const target = nodes.find(x => x.id === nodeId);

  if (target) {

    this.treeControl.expand(target);

  }

}
setPermission(node: any) {

  console.log('Set Permission', node);

}
auditTrail(node: any) {

  console.log('Audit Trail', node);

}

createBinder(node: any,type: string) {

  const dialogRef = this.dialog.open(BinderdialogComponent, {
width: '950px',
  maxWidth: '95vw',
  height: '85vh',
  panelClass: 'binder-dialog',
    disableClose: true,
    data: {
      parentNode: node
    }

  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result) return;

    console.log('Binder Data:', result);

    // 👉 API call here later
    /*
    this.menuService.createBinder({
      folderID: node.id,
      cardName: result.binderName,
      fields: result.fields
    }).subscribe(...)
    */

    // 👉 reload tree after success
    this.loadMenu(node);

  });

}
createDrawer(node: any) {
  console.log('Create Drawer', node);
}



deleteNode(node: any) {

  const dialogRef = this.dialog.open(ActionDialogComponent, {

     width: '450px',
    maxHeight: 'auto',
    panelClass: 'custom-dialog-container',
    disableClose: true,

    data: {

      mode: 'delete',

      title: 'Delete Confirmation',

      message: `Are you sure you want to delete "${node.name}" ?`

    }

  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result)
      return;

    const payload = {

      id: node.id,
      type: node.type,
      isDeleted: true

    };

    this.folderService.deleteNode(payload).subscribe(() => {

      this.loadMenu(node);

    });

  });

}

loadMenu(node: any){
  const userId = Number(localStorage.getItem('id'));
    const roleId = Number(localStorage.getItem('RoleID'));
this.menuService.getMenu(roleId, userId).subscribe({
      next: (data) => {
        // 🔥 map backend data → UI format
        const tree = this.mapTree(data, []);
        this.dataSource.data = tree;
        setTimeout(() => {
      this.restoreExpansion(node.id);
    }, 300);
      },
      error: (err) => console.error(err)
    });
}
addNewDocument(node: any) {

  console.log('Add New Document', node);

}

scanDocument(node: any) {

  console.log('Scan Document', node);

}

cutNode(node: any) {

  console.log('Cut', node);

}

copyNode(node: any) {

  console.log('Copy', node);

}

editNode(node: any) {

  console.log('Edit', node);

}
showDeletedDocuments(node: any) {

  console.log('Show Deleted Documents', node);

}
  getIcon(type: string): string {
    switch (type) {
      case 'Library': return 'dns';
      case 'Folder': return 'folder_open';
      case 'Vault': return 'storage';
      case 'Card': return 'description';
      default: return 'insert_drive_file';
    }
  }

  navigate(node: TreeNode) {
     this.selectedNodeId = node.id;

  this.documentService.setSelectedNode(node.id);

  localStorage.setItem('selectedNode', node.id.toString());
 setTimeout(() => {

    this.expandNodeById(node.id);

  }, 200);
  this.documentService.setBreadcrumb(node.breadcrumb || []);

   if (node.type !== 'Card') {
    this.navigateEvent.emit(node);
    return;
  }

  const userId = Number(localStorage.getItem('id'));
  const cardId = node.id;

  this.documentService.getDocuments(userId, cardId).subscribe({
    next: (data) => {
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
ngOnDestroy(): void {

  this.selectedNodeSub?.unsubscribe();

}
ngAfterViewInit() {

  setTimeout(() => {

    const saved = localStorage.getItem('selectedNode');

    if (saved) {

      this.selectedNodeId = +saved;

      this.expandNodeById(+saved);

    }

  }, 300);

}
clickLogo(){
  this.router.navigate(['/dashboard']);
}
}