import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmCreateComponent } from './tm-create.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
describe('TmCreateComponent', () => {
  let component: TmCreateComponent;
  let fixture: ComponentFixture<TmCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmCreateComponent, MatDialogModule],
      providers: [provideAnimations(), provideHttpClient(),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
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
