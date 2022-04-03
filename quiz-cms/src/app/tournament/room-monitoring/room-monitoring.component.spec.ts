import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomMonitoringComponent } from './room-monitoring.component';

describe('RoomMonitoringComponent', () => {
  let component: RoomMonitoringComponent;
  let fixture: ComponentFixture<RoomMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
