import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmHomeComponent } from './tm-home.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TaskService } from '../services/task.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('TmHomeComponent', () => {
  let component: TmHomeComponent;
  let fixture: ComponentFixture<TmHomeComponent>;
  let service: TaskService;
  let matDialog: MatDialog;
  let gridApi = { sizeColumnsToFit: () => { }, getRowNode: (a: any) => { return {}; } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmHomeComponent],
      providers: [provideAnimations(), provideHttpClient(),
        TaskService,
        MatDialog
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TmHomeComponent);
    service = fixture.debugElement.injector.get(TaskService);
    matDialog = fixture.debugElement.injector.get(MatDialog);
    component = fixture.componentInstance;
    service.tasks$ = of([{ title: 'Test', description: 'Test description', status: 'open' },
    { title: 'Test', description: 'Test description', status: 'unknown' } as any
    ]);
    fixture.detectChanges();
    if (component.gridOptions.onGridReady) {
      component.gridOptions.onGridReady({ api: gridApi } as any);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete row', () => {
    const deleteTaskSpy = spyOn(service, 'deleteTask').and.callFake(i => { });
    component.deleteRow(1);
    expect(deleteTaskSpy).toHaveBeenCalled();
  });

  it('should update row', () => {
    const data = { title: 'Test', description: 'Test description', status: 'inprogress' };
    const getRowNodeSpy = spyOn(gridApi, 'getRowNode').and.returnValue({ data });
    const openSpy = spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of({}) } as any);
    component.updateRow(data);
    expect(getRowNodeSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();
  });

  it('should open dialog', async () => {
    const openSpy = spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of({}) } as any);
    component.openDialog();
    expect(openSpy).toHaveBeenCalled();
  });
});
