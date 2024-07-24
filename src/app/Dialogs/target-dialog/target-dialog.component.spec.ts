import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetDialogComponent } from './target-dialog.component';

describe('TargetDialogComponent', () => {
  let component: TargetDialogComponent;
  let fixture: ComponentFixture<TargetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
