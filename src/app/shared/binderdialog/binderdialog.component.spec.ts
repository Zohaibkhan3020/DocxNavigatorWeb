import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinderdialogComponent } from './binderdialog.component';

describe('BinderdialogComponent', () => {
  let component: BinderdialogComponent;
  let fixture: ComponentFixture<BinderdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinderdialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BinderdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
