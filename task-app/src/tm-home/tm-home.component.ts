import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef, GridOptions, GridApi } from 'ag-grid-community'; // Column Definition Type Interface
import { TaskService } from '../services/task.service';
import { Task } from '../model/task';
import { Subscription } from 'rxjs';
import { TaskActionCellRendererComponent } from '../task-action-cell-renderer/task-action-cell-renderer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TmCreateComponent } from '../tm-create/tm-create.component';

@Component({
  selector: 'tm-home',
  standalone: true,
  imports: [AgGridAngular, TaskActionCellRendererComponent, MatButtonModule, MatDialogModule],
  templateUrl: './tm-home.component.html',
  styleUrl: './tm-home.component.scss'
})
export class TmHomeComponent implements OnInit, OnDestroy {
  // Row Data: The data to be displayed.
  rowData: Task[] = [];
  private subscriptions: Subscription[] = [];
  gridOptions!: GridOptions;
  gridApi!: GridApi;

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: 'title' },
    { field: 'description' },
    { field: 'status' },
    {
      field: 'delete', cellRenderer: TaskActionCellRendererComponent, minWidth: 80, width: 80, cellRendererParams: {
        action: 'delete',
        clicked: function (field: any) {
          alert(`${field} was deleted`);
        }
      }
    },
    {
      field: 'update', cellRenderer: TaskActionCellRendererComponent, minWidth: 80, width: 80, cellRendererParams: {
        action: 'update',
        clicked: function (field: any) {
          alert(`${field} was updated`);
        }
      }
    }
  ];

  constructor(private readonly taskService: TaskService,
    private readonly dialog: MatDialog
  ) {

  }
  ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.pop()?.unsubscribe();
    }
  }

  deleteRow(row: any) {
    const rowNode = this.gridApi.getRowNode(row);
    this.taskService.deleteTask(row).subscribe({
      next: val => {
        if (val.removed === 'SUCCESS') {
          this.gridApi.applyTransaction({ remove: [rowNode?.data] });
        }
      },
      error: val => {

      }
    });
  }

  updateRow(row: any) {
    const rowNode = this.gridApi.getRowNode(row);
    const data = rowNode?.data;
    this.openCreateDialog({ action: 'update', ...data });
    // this.taskService.deleteTask(row).subscribe({
    //   next: val => {
    //     if (val.removed === 'SUCCESS') {
    //       this.gridApi.applyTransaction({ remove: [rowNode?.data] });
    //     }
    //   },
    //   error: val => {

    //   }
    // });
  }

  ngOnInit(): void {
    this.gridOptions = {
      context: {
        instance: this
      },
      onGridReady: ready => {
        this.gridApi = ready.api;
      },
      getRowId: row => row.data.taskId
    } as GridOptions;
    this.taskService.getTasks();
    this.subscriptions.push(this.taskService.tasks.subscribe(val => this.rowData = val));
  }

  openDialog() {
    this.openCreateDialog(null);
  }

  private openCreateDialog(data: any) {
    const dialogRef = this.dialog.open(TmCreateComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
