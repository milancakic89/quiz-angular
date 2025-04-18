import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuestionsComponent } from './my-questions.component';

describe('MyQuestionsComponent', () => {
  let component: MyQuestionsComponent;
  let fixture: ComponentFixture<MyQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
