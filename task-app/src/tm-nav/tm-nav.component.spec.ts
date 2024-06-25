import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmNavComponent } from './tm-nav.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TmNavComponent', () => {
  let component: TmNavComponent;
  let fixture: ComponentFixture<TmNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideAnimations(),
        provideHttpClient()]
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
