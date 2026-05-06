import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-right-panel',
    templateUrl: './right-panel.component.html',
    styleUrls: ['./right-panel.component.css'],
    standalone: false
})
export class RightPanelComponent {
  editMode = false;
 @Input() activeView: 'preview' | 'metadata' | 'comments' = 'preview';

  @Input() fileType: 'pdf' | 'excel' | null = null;
@Input() previewUrl: any;
  @Input() document: any;

  @Output() viewChange = new EventEmitter<'preview' | 'metadata' | 'comments'>();

comments: any[] = [
  { user: 'Admin', text: 'Document reviewed', time: '10:30 AM' },
  { user: 'User1', text: 'Please update page 2', time: '11:00 AM' }
];
  changeView(view: 'preview' | 'metadata' | 'comments') {
    this.viewChange.emit(view);
  }

  newComment = '';

addComment() {
  if (!this.newComment.trim()) return;

  this.comments.push({
    user: 'Me',
    text: this.newComment,
    time: new Date().toLocaleTimeString()
  });

  this.newComment = '';
}

}