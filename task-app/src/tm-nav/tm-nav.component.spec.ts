import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmNavComponent } from './tm-nav.component';

describe('TmNavComponent', () => {
  let component: TmNavComponent;
  let fixture: ComponentFixture<TmNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
