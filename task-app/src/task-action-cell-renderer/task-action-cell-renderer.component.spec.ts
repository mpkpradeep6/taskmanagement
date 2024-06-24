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
  });
});
