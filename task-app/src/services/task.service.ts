import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private sTasks: BehaviorSubject<Task[]> = new BehaviorSubject([] as Task[]);
  public tasks: Observable<Task[]>;
  private sloginStatus: BehaviorSubject<any> = new BehaviorSubject(null);
  public loginStatus: Observable<any>;
  private baseUrl = 'http://localhost:6868';
  constructor(private readonly httpClient: HttpClient) {
    this.tasks = this.sTasks.asObservable();
    this.loginStatus = this.sloginStatus.asObservable();

  }

  public getTasks(): void {
    this.httpClient.get(`${this.baseUrl}/tasks`).subscribe((val: any) => {
      const results = val?.tasks || [];
      this.sTasks.next(results);
    });
  }

  public addTask(task: Task): Observable<any> {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post(`${this.baseUrl}/tasks/add`, task, { headers });
  }

  public deleteTask(taskId: number): Observable<any> {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.delete(`${this.baseUrl}/tasks/remove`, { headers, body: { taskId } });
  }

  public login(): void {
    this.sloginStatus.next({ login: true });
  }

}
