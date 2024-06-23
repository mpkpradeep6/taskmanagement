export interface Task {
    title: string;
    description: string;
    status: 'open' | 'todo' | 'inprogress' | 'done';
}