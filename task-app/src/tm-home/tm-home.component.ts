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
import { TaskUtils } from '../utils/task.utils';

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
    {
      field: 'delete', cellRenderer: TaskActionCellRendererComponent, headerName: '',
      resizable: false, sortable: false, filter: false, width: 65,
      cellRendererParams: { action: 'delete' }
    },
    {
      field: 'update', cellRenderer: TaskActionCellRendererComponent, headerName: '',
      resizable: false, sortable: false, filter: false, width: 65,
      cellRendererParams: { action: 'update' }
    },
    { field: 'title', tooltipField: 'title', filter: true },
    { field: 'description', tooltipField: 'description', filter: true },
    {
      field: 'status', resizable: false, filter: true,
      valueFormatter: params => TaskUtils.statusList.find(k => k.key === params.value)?.value || ''
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

  deleteRow(row: number) {
    this.taskService.deleteTask(row);
  }

  updateRow(row: any) {
    const rowNode = this.gridApi.getRowNode(row);
    const data = rowNode?.data;
    this.openCreateDialog({ action: 'update', ...data });
  }

  ngOnInit(): void {
    this.gridOptions = {
      context: {
        instance: this
      },
      defaultColDef: {
        suppressMovable: true,
      },
      onGridReady: ready => {
        this.gridApi = ready.api;
        this.gridApi.sizeColumnsToFit();
      },
      getRowId: row => row.data.taskId
    } as GridOptions;
    this.taskService.getTasks();
    this.subscriptions.push(this.taskService.tasks$.subscribe((val: any) => this.rowData = val));
    this.subscriptions.push(
      this.taskService.taskAction$.subscribe(val => {
        if (val?.action !== 'read') {
          this.taskService.getTasks();
        }
      }));
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
