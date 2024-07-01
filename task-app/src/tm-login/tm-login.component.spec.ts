import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmLoginComponent } from './tm-login.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AbstractControl } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { MockTaskService } from '../fixtures/mock-task.service';
import { IMockTaskService } from '../fixtures/mock-task.interface';

describe('TmLoginComponent', () => {
  let component: TmLoginComponent;
  let fixture: ComponentFixture<TmLoginComponent>;
  let mockTaskService: IMockTaskService = new MockTaskService(null);
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmLoginComponent],
      providers: [provideAnimations(), provideHttpClient()
        ,
      { provide: TaskService, useValue: mockTaskService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TmLoginComponent);
    component = fixture.componentInstance;
    taskService = fixture.debugElement.injector.get(TaskService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set validators when registered', () => {
    const ctrl: AbstractControl = component.loginForm.get('confirmPassword') || { setValidators: (a: any) => { } } as any;
    const setValidatorsSpy = spyOn(ctrl, 'setValidators').and.callFake(a => { });
    component.loginForm.get('newUser')?.setValue(true);
    expect(setValidatorsSpy).toHaveBeenCalled();
  });

  it('should set validators when login', () => {
    const ctrl: AbstractControl = component.loginForm.get('confirmPassword') || { setValidators: (a: any) => { } } as any;
    const setValidatorsSpy = spyOn(ctrl, 'setValidators').and.callFake(a => { });
    component.loginForm.get('newUser')?.setValue(false);
    expect(setValidatorsSpy).toHaveBeenCalled();
  });

  it('should set password mismatch error', () => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    const ctrl: AbstractControl = component.loginForm.get('confirmPassword') || { setValidators: (a: any) => { } } as any;
    const setValidatorsSpy = spyOn(ctrl, 'setValidators').and.callFake(a => { });
    component.loginForm.get('newUser')?.setValue(true);
    component.loginForm.get('password')?.setValue('');
    mockTaskService.setRespLogin({ action: 'login', status: 'failure', errorMessage: 'Error Occurred' });
    expect(component.loginStatusMessage).toBe('Error Occurred');
    jasmine.clock().tick(3000);
    component.loginForm.get('confirmPassword')?.setValue('abc12345');
    component.loginForm.get('password')?.setValue('Abc123*');
    component.loginForm.get('confirmPassword')?.setValue('abc123*');
    expect(setValidatorsSpy).toHaveBeenCalled();
    mockTaskService.setRespLogin({ action: 'logout', status: 'failure', errorMessage: '' });
    expect(component.loginStatusMessage).toBe('');
    jasmine.clock().tick(3000);
  });
  it('should call login', () => {
    const loginSpy = spyOn(taskService, 'login').and.callFake((a, b) => { });
    component.onSubmit();
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should check password allowed chars', () => {
    expect(component.passwordAllowedChars({ which: 65, preventDefault() { } })).toBeTrue();
    expect(component.passwordAllowedChars({ charCode: '0x3F', preventDefault() { } })).toBeFalse();
  });

  it('should check user name allowed chars', () => {
    expect(component.onPaste({ preventDefault() { } })).toBeFalse();
    expect(component.usernameAllowedChars({ which: 65, preventDefault() { } })).toBeTrue();
    expect(component.usernameAllowedChars({ charCode: '0x3F', preventDefault() { } })).toBeFalse();
  });

});
