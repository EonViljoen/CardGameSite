import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnWindowComponent } from './turn-window.component';

describe('TurnWindowComponent', () => {
  let component: TurnWindowComponent;
  let fixture: ComponentFixture<TurnWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
