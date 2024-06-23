import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmCreateComponent } from './tm-create.component';

describe('TmCreateComponent', () => {
  let component: TmCreateComponent;
  let fixture: ComponentFixture<TmCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
