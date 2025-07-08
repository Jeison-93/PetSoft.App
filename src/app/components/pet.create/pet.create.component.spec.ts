import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetCreateComponent } from './pet.create.component';

describe('PetCreateComponent', () => {
  let component: PetCreateComponent;
  let fixture: ComponentFixture<PetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
