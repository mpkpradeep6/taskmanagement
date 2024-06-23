import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'tm-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
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
    { value: 'Open', key: 'done' }
  ];

  taskForm: FormGroup;

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
    
  }

  onSubmit() {
    this.taskService.addTask(this.taskForm.value).subscribe({
      next: nextValue => {
        console.log(nextValue);
      },
      error: errorValue => {
        console.log(errorValue);
      }
    });
    console.log(this.taskForm.value);
  }
}