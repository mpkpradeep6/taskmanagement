import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../services/task.service';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../model/task';

@Component({
  selector: 'tm-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './tm-create.component.html',
  styleUrl: './tm-create.component.scss'
})
export class TmCreateComponent implements OnInit {
  readonly statusList = [
    { value: 'Open', key: 'open' },
    { value: 'To Do', key: 'todo' },
    { value: 'In Progress', key: 'inprogress' },
    { value: 'Done', key: 'done' }
  ];

  taskForm: FormGroup;
  componentTitle = 'Add Task';
  actionLabel = 'Add';
  private readonly data = inject<any>(MAT_DIALOG_DATA);
  constructor(private readonly formBuilder: FormBuilder,
    private readonly taskService: TaskService
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      status: ['', Validators.required]
    });
    this.taskForm.get('status')?.setValue('open');
  }
  ngOnInit(): void {
    if (this.data?.action === 'update') {
      this.componentTitle = 'Update Task';
      this.actionLabel = 'Update';
      this.taskForm.patchValue({
        title: this.data.title,
        description: this.data.description,
        status: this.data.status
      });
    }
  }

  onSubmit() {
    const isUpdate = this.data?.action === 'update';
    const data = this.taskForm.value as Task;
    if (isUpdate) {
      data.taskId = this.data.taskId;
    }
    this.taskService.addTask(data, isUpdate);
  }
}
