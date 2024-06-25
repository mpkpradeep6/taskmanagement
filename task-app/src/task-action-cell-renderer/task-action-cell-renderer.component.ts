import { Component, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'task-action',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './task-action-cell-renderer.component.html',
  styleUrl: './task-action-cell-renderer.component.scss'
})
export class TaskActionCellRendererComponent implements ICellRendererAngularComp, OnDestroy {
  private params: any;
  action = 'delete';
  refresh(params: any): boolean {
    return true;
  }

  agInit(params: any): void {
    this.params = params;
    this.action = this.params.action;
  }

  btnClickedHandler(event: any) {
    if (this.action === 'delete') {
      this.params.context.instance.deleteRow(this.params.data.taskId);
    }
    else if (this.action === 'update') {
      this.params.context.instance.updateRow(this.params.data.taskId);
    }
  }

  ngOnDestroy() {
    // remove
  }

}
