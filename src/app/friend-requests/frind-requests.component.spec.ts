import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrindRequestsComponent } from './frind-requests.component';

describe('FrindRequestsComponent', () => {
  let component: FrindRequestsComponent;
  let fixture: ComponentFixture<FrindRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrindRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrindRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
