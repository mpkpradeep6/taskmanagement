import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { TaskService } from '../services/task.service';
import { Task } from '../model/task';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tm-home',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './tm-home.component.html',
  styleUrl: './tm-home.component.scss'
})
export class TmHomeComponent implements OnInit, OnDestroy {
  // Row Data: The data to be displayed.
  rowData: Task[] = [];
  private subscriptions: Subscription[] = [];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: 'title' },
    { field: 'description' },
    { field: 'status' }
  ];

  constructor(private readonly taskService: TaskService) {

  }
  ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.pop()?.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.taskService.getTasks();
    this.subscriptions.push(this.taskService.tasks.subscribe(val => this.rowData = val));
  }
}
