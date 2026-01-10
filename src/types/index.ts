export type Priority = 'low' | 'medium' | 'high';

export interface SubTask {
    id: string;
    title: string;
    isCompleted: boolean;
    priority: Priority;
    parentId: string;
}

export interface MainTask {
    id: string;
    title: string;
    isCompleted: boolean;
    priority: Priority;
    subtasks: SubTask[];
    createdAt: number;
}
