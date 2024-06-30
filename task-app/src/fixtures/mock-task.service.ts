import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../model/task';
import { TaskAction } from '../model/task-action';
import { User } from '../model/user';
import { IMockTaskService } from './mock-task.interface';

export class MockTaskService implements IMockTaskService {
    private sTasks: BehaviorSubject<Task[]> = new BehaviorSubject([] as Task[]);
    private sloginStatus: BehaviorSubject<any> = new BehaviorSubject(null);
    private sTaskAction: BehaviorSubject<TaskAction> = new BehaviorSubject(null as unknown as TaskAction);
    private sError: BehaviorSubject<any> = new BehaviorSubject(null);

    public loginStatus$: Observable<any>;
    public tasks$: Observable<Task[]>;
    public taskAction$: Observable<TaskAction>;
    public error$: Observable<any>;
    constructor(httpClient: HttpClient|null) {
        this.tasks$ = this.sTasks.asObservable();
        this.loginStatus$ = this.sloginStatus.asObservable();
        this.taskAction$ = this.sTaskAction.asObservable();
        this.error$ = this.sError.asObservable();
    }
    public getTasks(): void { }
    public addTask(task: Task, update = false) { }
    public deleteTask(taskId: number) { }
    public login(user: User, isRegister = false): void { }
    public logout(user: User): void { }
    public resetError() {
        this.sError.next(null);
    }
    
    setRespTasks(tasks: Task[]): void {
        this.sTasks.next(tasks);
    }
    setRespAddTask(resp: any): void {
        this.sTaskAction.next(resp);
    }
    setRespLogin(resp: any): void {
        this.sloginStatus.next(resp);
    }
}