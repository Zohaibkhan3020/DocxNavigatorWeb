import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-right-panel',
    templateUrl: './right-panel.component.html',
    styleUrls: ['./right-panel.component.css'],
    standalone: false
})
export class RightPanelComponent {
  editMode = false;
 @Input() activeView: 'preview' | 'metadata' = 'preview';

  @Input() fileType: 'pdf' | 'excel' | null = null;
@Input() previewUrl: any;
  @Input() document: any;

  @Output() viewChange = new EventEmitter<'preview' | 'metadata'>();

  changeView(view: 'preview' | 'metadata') {
    this.viewChange.emit(view);
  }
}