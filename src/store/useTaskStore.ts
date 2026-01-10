import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainTask, Priority, SubTask } from '../types';

interface TaskState {
    tasks: MainTask[];
    addTask: (title: string, priority: Priority) => void;
    addSubTask: (parentId: string, title: string, priority: Priority) => void;
    toggleTask: (taskId: string) => void;
    toggleSubTask: (subTaskId: string, parentId: string) => void;
    deleteTask: (taskId: string) => void;
    deleteSubTask: (subTaskId: string, parentId: string) => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

export const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            tasks: [],

            addTask: (title, priority) => {
                set((state) => ({
                    tasks: [
                        {
                            id: generateId(),
                            title,
                            priority,
                            isCompleted: false,
                            subtasks: [],
                            createdAt: Date.now(),
                        },
                        ...state.tasks,
                    ],
                }));
            },

            addSubTask: (parentId, title, priority) => {
                set((state) => {
                    const newSubTask: SubTask = {
                        id: generateId(),
                        title,
                        priority,
                        isCompleted: false,
                        parentId,
                    };

                    return {
                        tasks: state.tasks.map((task) => {
                            if (task.id !== parentId) return task;

                            const updatedSubtasks = [...task.subtasks, newSubTask];
                            // Recalculate completion (if adding a new incomplete task, parent becomes incomplete)
                            // Logic: Parent is complete ONLY if subtasks > 0 and ALL are complete.
                            // Wait, if parent has subtasks, it tracks them. If I add a new one (incomplete), parent is incomplete.
                            const isCompleted = updatedSubtasks.every((st) => st.isCompleted);

                            return {
                                ...task,
                                subtasks: updatedSubtasks,
                                isCompleted: updatedSubtasks.length > 0 ? isCompleted : task.isCompleted,
                            };
                        }),
                    };
                });
            },

            toggleTask: (taskId) => {
                set((state) => ({
                    tasks: state.tasks.map((task) => {
                        if (task.id !== taskId) return task;

                        // If has subtasks, strictly derived from them. Manual toggle ignored (or valid only if 0 subtasks).
                        if (task.subtasks.length > 0) {
                            return task; // No manual toggle allowed
                        }

                        return { ...task, isCompleted: !task.isCompleted };
                    }),
                }));
            },

            toggleSubTask: (subTaskId, parentId) => {
                set((state) => ({
                    tasks: state.tasks.map((task) => {
                        if (task.id !== parentId) return task;

                        const updatedSubtasks = task.subtasks.map((st) =>
                            st.id === subTaskId ? { ...st, isCompleted: !st.isCompleted } : st
                        );

                        const allCompleted = updatedSubtasks.every((st) => st.isCompleted);

                        return {
                            ...task,
                            subtasks: updatedSubtasks,
                            isCompleted: allCompleted,
                        };
                    }),
                }));
            },

            deleteTask: (taskId) => {
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== taskId),
                }));
            },

            deleteSubTask: (subTaskId, parentId) => {
                set((state) => ({
                    tasks: state.tasks.map((task) => {
                        if (task.id !== parentId) return task;

                        const updatedSubtasks = task.subtasks.filter((st) => st.id !== subTaskId);

                        // If no subtasks left, does parent revert to manual?
                        // If 0 subtasks left, parent keeps its current state until manually toggled?
                        // Or if all (0) are completed? effectively yes?
                        // Let's say if 0 subtasks, allow manual. State remains whatever it was.

                        // If items remain, recheck completion
                        let isCompleted = task.isCompleted;
                        if (updatedSubtasks.length > 0) {
                            isCompleted = updatedSubtasks.every(st => st.isCompleted);
                        }

                        return {
                            ...task,
                            subtasks: updatedSubtasks,
                            isCompleted,
                        };
                    }),
                }));
            },
        }),
        {
            name: 'dotree-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
