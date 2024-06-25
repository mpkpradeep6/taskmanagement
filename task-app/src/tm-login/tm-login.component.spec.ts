import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmLoginComponent } from './tm-login.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TmLoginComponent', () => {
  let component: TmLoginComponent;
  let fixture: ComponentFixture<TmLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmLoginComponent],
      providers:[provideAnimations(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
