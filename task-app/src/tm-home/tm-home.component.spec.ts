import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmHomeComponent } from './tm-home.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TmHomeComponent', () => {
  let component: TmHomeComponent;
  let fixture: ComponentFixture<TmHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmHomeComponent],
      providers:[provideAnimations(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
