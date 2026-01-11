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
            // Keep input open for rapid entry
        }
    };

    return (
        <View style={[styles.container, expanded && styles.containerExpanded]}>
            {/* Main Task Row */}
            <TouchableOpacity
                style={styles.mainRow}
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.7}
            >
                <View style={[styles.priorityIndicator, { backgroundColor: colors.priority[task.priority] }]} />

                <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkbox}>
                    {task.isCompleted ? (
                        <View style={[styles.checkedBox, expanded && styles.checkedBoxExpanded]}>
                            <Check size={14} color={expanded ? colors.black : colors.white} />
                        </View>
                    ) : (
                        <View style={[
                            styles.uncheckedBox,
                            task.subtasks.length > 0 && styles.disabledBox,
                            expanded && styles.uncheckedBoxExpanded
                        ]} />
                    )}
                </TouchableOpacity>

                <Text style={[
                    styles.title,
                    expanded && styles.titleExpanded,
                    task.isCompleted && styles.completedText
                ]}>
                    {task.title}
                </Text>

                {expanded ?
                    <ChevronDown size={20} color={colors.white} /> :
                    <ChevronRight size={20} color={colors.textSecondary} />
                }
            </TouchableOpacity>

            {/* Expanded Content */}
            {expanded && (
                <View style={styles.subList}>
                    {task.subtasks.map((sub) => (
                        <View key={sub.id} style={styles.subItem}>
                            <View style={[styles.priorityDot, { backgroundColor: colors.priority[sub.priority] }]} />

                            <TouchableOpacity onPress={() => toggleSubTask(sub.id, task.id)} style={styles.checkboxSmall}>
                                {sub.isCompleted ? (
                                    <View style={[styles.checkedBoxSmall, styles.checkedBoxSmallExpanded]}>
                                        <Check size={12} color={colors.black} />
                                    </View>
                                ) : (
                                    <View style={[styles.uncheckedBoxSmall, styles.uncheckedBoxSmallExpanded]} />
                                )}
                            </TouchableOpacity>

                            <Text style={[
                                styles.subTitle,
                                styles.subTitleExpanded,
                                sub.isCompleted && styles.completedText
                            ]}>
                                {sub.title}
                            </Text>

                            <TouchableOpacity onPress={() => deleteSubTask(sub.id, task.id)}>
                                <Trash2 size={16} color={'#AAAAAA'} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add Subtask Input */}
                    {isAddingSub ? (
                        <View style={styles.addSubContainer}>
                            <TextInput
                                style={[styles.input, styles.inputExpanded]}
                                placeholder="Subtask title..."
                                placeholderTextColor="#888888"
                                value={newSubTitle}
                                onChangeText={setNewSubTitle}
                                autoFocus
                                onSubmitEditing={handleAddSubTask}
                                blurOnSubmit={false}
                            />
                            <View style={styles.priorityRow}>
                                <PrioritySelector
                                    selected={newSubPriority}
                                    onSelect={setNewSubPriority}
                                    selectedBorderColor={colors.white}
                                />
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        onPress={() => setIsAddingSub(false)}
                                        style={[styles.cancelBtn, styles.cancelBtnExpanded]}
                                    >
                                        <Plus size={18} color={colors.black} style={{ transform: [{ rotate: '45deg' }] }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleAddSubTask}
                                        style={[styles.addBtnSmall, styles.addBtnSmallExpanded]}
                                    >
                                        <Check size={18} color={colors.black} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.addSubBtn} onPress={() => setIsAddingSub(true)}>
                            <Plus size={16} color={'#DDDDDD'} />
                            <Text style={[styles.addSubText, styles.addSubTextExpanded]}>Add Subtask</Text>
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
        borderWidth: 1,
        borderColor: colors.text,
        borderRadius: 8,
        overflow: 'hidden',
    },
    containerExpanded: {
        backgroundColor: colors.text,
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    priorityIndicator: {
        width: 4,
        height: '80%',
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
    uncheckedBoxExpanded: {
        borderColor: colors.white,
    },
    checkedBox: {
        width: 20,
        height: 20,
        backgroundColor: colors.text,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedBoxExpanded: {
        backgroundColor: colors.white,
    },
    disabledBox: {
        borderColor: colors.textSecondary,
        opacity: 0.5,
    },
    title: {
        flex: 1,
        fontSize: 20,
        color: colors.text,
        fontWeight: 'bold',
    },
    titleExpanded: {
        color: colors.white,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    subList: {
        paddingLeft: 40,
        paddingRight: 12,
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
    uncheckedBoxSmallExpanded: {
        borderColor: '#AAAAAA',
    },
    checkedBoxSmall: {
        width: 16,
        height: 16,
        backgroundColor: colors.textSecondary,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedBoxSmallExpanded: {
        backgroundColor: '#AAAAAA',
    },
    subTitle: {
        flex: 1,
        fontSize: 18,
        color: colors.textSecondary,
    },
    subTitleExpanded: {
        color: '#DDDDDD', // Lighter grey for visibility on black
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
        fontSize: 16,
    },
    addSubTextExpanded: {
        color: '#DDDDDD',
    },
    addSubContainer: {
        marginTop: 8,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 4,
        fontSize: 18,
        marginBottom: 8,
        color: colors.text,
    },
    inputExpanded: {
        color: colors.white,
        borderBottomColor: '#666666',
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
    addBtnSmallExpanded: {
        backgroundColor: colors.white,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: colors.text,
        borderRadius: 20,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtnExpanded: {
        backgroundColor: '#FF4444', // Red for cancel
    },
    deleteTaskBtn: {
        marginTop: 16,
        alignSelf: 'flex-start',
    },
    deleteText: {
        color: '#FF0000',
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});
