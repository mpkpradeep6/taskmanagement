import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskActionCellRendererComponent } from './task-action-cell-renderer.component';

describe('TaskActionCellRendererComponent', () => {
  let component: TaskActionCellRendererComponent;
  let fixture: ComponentFixture<TaskActionCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskActionCellRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskActionCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.refresh(null)).toBeTrue();
  });

  it('should call deleteRow method', ()=>{
    const params = { action: 'delete', data: { taskId: 1 }, context: { instance: { deleteRow: (id: any) => { }, updateRow: (id: any) => { } } } };
    const deleteSpy = spyOn(params.context.instance, 'deleteRow').and.callThrough();
    component.agInit(params);
    component.btnClickedHandler(null);
    expect(component.action).toEqual('delete');
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should call updateRow method', ()=>{
    const params = { action: 'update', data: { taskId: 1 }, context: { instance: { deleteRow: (id: any) => { }, updateRow: (id: any) => { } } } };
    const updateSpy = spyOn(params.context.instance, 'updateRow').and.callThrough();
    component.agInit(params);
    component.btnClickedHandler(null);
    expect(component.action).toEqual('update');
    expect(updateSpy).toHaveBeenCalled();
  });
});
