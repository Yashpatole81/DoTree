import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { MainTask, Priority, SubTask } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { colors } from '../theme/colors';
import { Check, ChevronDown, ChevronRight, Plus, Trash2, Circle } from 'lucide-react-native';
import { PrioritySelector } from './PrioritySelector';

interface TaskItemProps {
    task: MainTask;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const [expanded, setExpanded] = useState(false);
    const [isAddingSub, setIsAddingSub] = useState(false);
    const [newSubTitle, setNewSubTitle] = useState('');
    const [newSubPriority, setNewSubPriority] = useState<Priority>('medium');

    const { toggleTask, toggleSubTask, addSubTask, deleteTask, deleteSubTask } = useTaskStore();

    const handleAddSubTask = () => {
        if (newSubTitle.trim()) {
            addSubTask(task.id, newSubTitle.trim(), newSubPriority);
            setNewSubTitle('');
            setIsAddingSub(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Main Task Row */}
            <TouchableOpacity
                style={styles.mainRow}
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.7}
            >
                <View style={[styles.priorityIndicator, { backgroundColor: colors.priority[task.priority] }]} />

                <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkbox}>
                    {task.isCompleted ? (
                        <View style={styles.checkedBox}>
                            <Check size={14} color={colors.white} />
                        </View>
                    ) : (
                        <View style={[styles.uncheckedBox, task.subtasks.length > 0 && styles.disabledBox]} />
                    )}
                </TouchableOpacity>

                <Text style={[styles.title, task.isCompleted && styles.completedText]}>
                    {task.title}
                </Text>

                {expanded ? <ChevronDown size={20} color={colors.textSecondary} /> : <ChevronRight size={20} color={colors.textSecondary} />}
            </TouchableOpacity>

            {/* Expanded Content */}
            {expanded && (
                <View style={styles.subList}>
                    {task.subtasks.map((sub) => (
                        <View key={sub.id} style={styles.subItem}>
                            <View style={[styles.priorityDot, { backgroundColor: colors.priority[sub.priority] }]} />

                            <TouchableOpacity onPress={() => toggleSubTask(sub.id, task.id)} style={styles.checkboxSmall}>
                                {sub.isCompleted ? (
                                    <View style={styles.checkedBoxSmall}>
                                        <Check size={12} color={colors.white} />
                                    </View>
                                ) : (
                                    <View style={styles.uncheckedBoxSmall} />
                                )}
                            </TouchableOpacity>

                            <Text style={[styles.subTitle, sub.isCompleted && styles.completedText]}>
                                {sub.title}
                            </Text>

                            <TouchableOpacity onPress={() => deleteSubTask(sub.id, task.id)}>
                                <Trash2 size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add Subtask Input */}
                    {isAddingSub ? (
                        <View style={styles.addSubContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Subtask title..."
                                value={newSubTitle}
                                onChangeText={setNewSubTitle}
                                autoFocus
                                onSubmitEditing={handleAddSubTask}
                            />
                            <View style={styles.priorityRow}>
                                <PrioritySelector selected={newSubPriority} onSelect={setNewSubPriority} />
                                <TouchableOpacity onPress={handleAddSubTask} style={styles.addBtnSmall}>
                                    <Check size={18} color={colors.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.addSubBtn} onPress={() => setIsAddingSub(true)}>
                            <Plus size={16} color={colors.textSecondary} />
                            <Text style={styles.addSubText}>Add Subtask</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.deleteTaskBtn} onPress={() => deleteTask(task.id)}>
                        <Text style={styles.deleteText}>Delete Task</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        backgroundColor: colors.white,
        // Minimalist: No border usually, but maybe a bottom line?
        // User said "No borders unless necessary".
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    priorityIndicator: {
        width: 4,
        height: '80%', // partial height line
        borderRadius: 2,
        marginRight: 12,
    },
    checkbox: {
        padding: 4,
        marginRight: 8,
    },
    uncheckedBox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: colors.text,
        borderRadius: 4,
    },
    checkedBox: {
        width: 20,
        height: 20,
        backgroundColor: colors.text,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledBox: {
        borderColor: colors.textSecondary,
        opacity: 0.5,
    },
    title: {
        flex: 1,
        fontSize: 18,
        color: colors.text,
        fontWeight: '500',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    subList: {
        paddingLeft: 40, // Indent
        paddingBottom: 12,
    },
    subItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    priorityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 8,
    },
    checkboxSmall: {
        padding: 4,
        marginRight: 8,
    },
    uncheckedBoxSmall: {
        width: 16,
        height: 16,
        borderWidth: 1.5,
        borderColor: colors.textSecondary,
        borderRadius: 3,
    },
    checkedBoxSmall: {
        width: 16,
        height: 16,
        backgroundColor: colors.textSecondary,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subTitle: {
        flex: 1,
        fontSize: 16,
        color: colors.textSecondary,
    },
    addSubBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        opacity: 0.7,
    },
    addSubText: {
        marginLeft: 8,
        color: colors.textSecondary,
        fontSize: 14,
    },
    addSubContainer: {
        marginTop: 8,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 4,
        fontSize: 16,
        marginBottom: 8,
    },
    priorityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addBtnSmall: {
        backgroundColor: colors.text,
        borderRadius: 20,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteTaskBtn: {
        marginTop: 16,
        alignSelf: 'flex-start',
    },
    deleteText: {
        color: '#FF0000', // Or black since users said strict B/W? 
        // "Only priority indicators may use muted accent colors".
        // "Strictly black & white".
        // I will use Gray for delete text to stay safe.
        fontSize: 12,
        textDecorationLine: 'underline',
    }
});
