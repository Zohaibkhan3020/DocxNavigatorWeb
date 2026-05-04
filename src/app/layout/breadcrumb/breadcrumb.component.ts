import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css'],
    standalone: false
})
export class BreadcrumbComponent {
   @Input() items: string[] = [];

  // 🔥 NEW INPUT
  @Input() rightPanelOpen = true;

  // 🔥 OUTPUT EVENT
  @Output() toggleRightPanel = new EventEmitter<void>();
}
