import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TmCreateComponent } from './tm-create.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
describe('TmCreateComponent', () => {
  let component: TmCreateComponent;
  let fixture: ComponentFixture<TmCreateComponent>;

  let dialogModel = { action: 'update', taskId: 1 } as any;
  let service: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmCreateComponent, MatDialogModule],
      providers: [
        provideAnimations(), provideHttpClient(),
        { provide: MAT_DIALOG_DATA, useValue: dialogModel },
        { provide: MatDialogRef, useValue: {} },
        TaskService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TmCreateComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(TaskService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    const spyObj = spyOn(service, 'addTask').and.callFake((a, b) => void 0);
    component.onSubmit();
    expect(spyObj).toHaveBeenCalled();
  });

});
