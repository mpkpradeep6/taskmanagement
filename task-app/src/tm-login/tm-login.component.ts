import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Subscription, filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tm-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './tm-login.component.html'
})
export class TmLoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loginAction = 'Login';
  loginStatusMessage = '';
  private isRegister = false;
  private subscriptions = [] as Subscription[];
  constructor(private readonly formBuilder: FormBuilder,
    private readonly taskService: TaskService
  ) {
    
    
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: [''],
      newUser: ['']
    }, { validator: this.checkPassword('password', 'confirmPassword') });

    const subscribe = this.loginForm.get('newUser')?.valueChanges.subscribe(val => {
      if (val) {
        this.loginAction = 'Register';
        this.loginForm.get('confirmPassword')?.setValidators(Validators.required);
        this.isRegister = true;
      } else {
        this.loginAction = 'Login';
        this.loginForm.get('confirmPassword')?.setValidators(null);
        this.loginForm.get('confirmPassword')?.setErrors(null);
        this.isRegister = false;
      }
    });
    if (subscribe) {
      this.subscriptions.push(subscribe);
    }
    this.subscriptions.push(this.taskService.loginStatus$.pipe(filter(f => !!f)).subscribe(val => {
      if (val.action !== 'login' || val.status !== 'success') {
        this.loginStatusMessage = val.errorMessage || '';
        setTimeout(() => {
          this.loginStatusMessage = '';
        }, 3000);
      }
    }));
  }
  ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.pop()?.unsubscribe();
    }
  }

  checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
        return;
      }
      const newUser = formGroup.controls['newUser'];
      if (newUser.value && control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
}

  onSubmit() {
    const user = { user: this.loginForm.value.username, password: this.loginForm.value.password };
    this.taskService.login(user, this.isRegister);
  }
}
