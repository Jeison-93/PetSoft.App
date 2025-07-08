import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBoardComponent } from './client.board.component';

describe('ClientBoardComponent', () => {
  let component: ClientBoardComponent;
  let fixture: ComponentFixture<ClientBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
