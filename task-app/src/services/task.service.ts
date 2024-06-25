import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../model/task';
import { TaskAction } from '../model/task-action';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private sTasks: BehaviorSubject<Task[]> = new BehaviorSubject([] as Task[]);
  private sloginStatus: BehaviorSubject<any> = new BehaviorSubject(null);
  private sTaskAction: BehaviorSubject<TaskAction> = new BehaviorSubject(null as unknown as TaskAction);
  private sError: BehaviorSubject<any> = new BehaviorSubject(null);

  public loginStatus$: Observable<any>;
  public tasks$: Observable<Task[]>;
  public taskAction$: Observable<TaskAction>;
  public error$: Observable<any>;
  private baseUrl = 'http://localhost:6868';
  private refreshToken = '';
  private accessToken = '';
  constructor(private readonly httpClient: HttpClient) {
    this.tasks$ = this.sTasks.asObservable();
    this.loginStatus$ = this.sloginStatus.asObservable();
    this.taskAction$ = this.sTaskAction.asObservable();
    this.error$ = this.sError.asObservable();
  }

  public getTasks(): void {
    const headers = this.getHeaders();
    this.httpClient.get(`${this.baseUrl}/tasks`, { headers })
    .subscribe(
      (val: any) => {
        if (val.errorCode === 0) {
          this.sTasks.next( val?.response?.tasks || []);
        } else {
          this.sError.next({ errorCode: val.errorCode, errorMessage: val.errorMessage });
        }
      }
    );
  }

  public addTask(task: Task, update = false) {
    this.resetError();
    const headers = this.getHeaders();
    if (update) {
      this.httpClient.put(`${this.baseUrl}/tasks/update`, task, { headers }).subscribe(
        (val: any) => {
          if (val.errorCode === 0) {
            this.sTaskAction.next({ action: 'update', status: val.response });
          } else {
            this.sError.next({ errorCode: val.errorCode, errorMessage: val.errorMessage });
          }
        }
      );
    } else {
      this.httpClient.post(`${this.baseUrl}/tasks/add`, task, { headers }).subscribe(
        (val: any) => {
          if (val.errorCode === 0) {
            this.sTaskAction.next({ action: 'add', status: val.response });
          } else {
            this.sError.next({ errorCode: val.errorCode, errorMessage: val.errorMessage });
          }
        }
      );
    }
  }

  public deleteTask(taskId: number) {

    const headers = this.getHeaders();
    this.httpClient.delete(`${this.baseUrl}/tasks/remove`, { headers, body: { taskId } }).subscribe(
      (val: any) => {
        if (val.errorCode === 0) {
          this.sTaskAction.next({ action: 'remove', status: val.response });
        } else {
          this.sError.next({ errorCode: val.errorCode, errorMessage: val.errorMessage });
        }
      }
    );
  }

  public login(user: User, isRegister = false): void {
    const headers = new HttpHeaders();
    const action = isRegister ? 'create' : 'login';
    headers.append('Content-Type', 'application/json');
    this.httpClient.post(`${this.baseUrl}/users/${action}`, user, { headers }).subscribe({
      next: (val: any) => {
        if (val.errorCode === 0) {
          if (!isRegister) {
            this.accessToken = val.response.accessToken;
            this.refreshToken = val.response.refreshToken;
          }
          this.sloginStatus.next({ action, status: 'success', errorMessage: val.errorMessage });
        } else {
          this.sloginStatus.next({ action, status: 'failure', errorMessage: val.errorMessage });
        }
      },
      error: (val: any) => {
        this.sloginStatus.next({ action, status: 'failure', errorMessage: val.error?.errorMessage });
      }
    });
  }

  public logout(user: User): void {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    this.httpClient.delete(`${this.baseUrl}/logout`, { headers, body: { user: user.user } }).subscribe(val => {
      console.log('Logout');
    });
  }

  public resetError() {
    this.sError.next(null);
  }

  private getHeaders() {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    );
    return headers;
  }

}
