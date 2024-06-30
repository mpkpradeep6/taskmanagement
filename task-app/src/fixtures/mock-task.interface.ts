import { Task } from '../model/task';
export interface IMockTaskService {
    setRespTasks(tasks: Task[]): void;
    setRespAddTask(resp: any): void;
    setRespLogin(resp: any): void;
}