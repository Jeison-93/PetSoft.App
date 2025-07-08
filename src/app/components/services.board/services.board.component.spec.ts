import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesBoardComponent } from './services.board.component';

describe('ServicesBoardComponent', () => {
  let component: ServicesBoardComponent;
  let fixture: ComponentFixture<ServicesBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicesBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
