import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureProfileComponent } from './creature-profile.component';

describe('CreatureProfileComponent', () => {
  let component: CreatureProfileComponent;
  let fixture: ComponentFixture<CreatureProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatureProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatureProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
