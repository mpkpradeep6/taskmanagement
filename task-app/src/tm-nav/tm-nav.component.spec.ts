import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmNavComponent } from './tm-nav.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TaskService } from '../services/task.service';
import { MockTaskService } from '../fixtures/mock-task.service';
import { IMockTaskService } from '../fixtures/mock-task.interface';

describe('TmNavComponent', () => {
  let component: TmNavComponent;
  let fixture: ComponentFixture<TmNavComponent>;
  let service: TaskService;
  let mockService: IMockTaskService = new MockTaskService(null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideAnimations(),
        provideHttpClient(),
        TaskService,
        {provide: TaskService, useValue: mockService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmNavComponent);
    service = fixture.debugElement.injector.get(TaskService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the menu home', () => {
    mockService.setRespLogin({ action: 'login', status: 'success' });
    expect(component.selectedMenu).toEqual('home');
  });

  it('should logout', () => {
    component.onSelect({ key: 'login' });
    component.onSelect({ key: 'logout' });
    expect(component.selectedMenu).toEqual('login');
  });
});
