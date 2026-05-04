import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  setSearch(value: string) {
    this.searchSubject.next(value);
  }
  private mode = new BehaviorSubject<'tree' | 'search'>('tree');

mode$ = this.mode.asObservable();

setMode(value: 'tree' | 'search') {
  this.mode.next(value);
}

// ✅ ADD THIS (important)
getModeValue(): 'tree' | 'search' {
  return this.mode.getValue();
}
}