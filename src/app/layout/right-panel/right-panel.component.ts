import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css'],
  standalone: false
})
export class RightPanelComponent implements OnChanges {

  editMode = false;
metadataFields: any[] = [];
  // 🔥 VIEW
  @Input() activeView: 'preview' | 'metadata' | 'comments' = 'preview';

  // 🔥 FILE
  @Input() fileType: 'pdf' | 'excel' | null = null;

  @Input() previewUrl: any;

  @Input() document: any;

  // 🔥 EVENTS
  @Output() viewChange =
    new EventEmitter<'metadata' | 'comments'>();

  // 🔥 COMMENTS
  comments: any[] = [
    {
      user: 'Admin',
      text: 'Document reviewed',
      time: '10:30 AM'
    },
    {
      user: 'User1',
      text: 'Please update page 2',
      time: '11:00 AM'
    }
  ];

  newComment = '';

  // 🔥 CHANGE TAB
  changeView(view: 'metadata' | 'comments') {

    this.activeView = view;

    this.viewChange.emit(view);
  }

  // 🔥 ADD COMMENT
  addComment() {

    if (!this.newComment.trim()) return;

    this.comments.push({
      user: 'Me',
      text: this.newComment,
      time: new Date().toLocaleTimeString()
    });

    this.newComment = '';
  }
toggleMetaComment() {

  this.activeView =
    this.activeView === 'metadata'
      ? 'comments'
      : 'metadata';

  this.viewChange.emit(this.activeView);
}
  ngOnChanges(changes: SimpleChanges): void {

  if (changes['document'] && this.document) {

    this.generateMetadata();
  }
}
generateMetadata() {

  this.metadataFields = [];

  Object.keys(this.document).forEach(key => {

    this.metadataFields.push({
      key: key,
      label: this.formatLabel(key),
      value: this.document[key]
    });

  });
}
formatLabel(key: string): string {

  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}
}