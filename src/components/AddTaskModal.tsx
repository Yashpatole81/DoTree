import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { Priority } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { PrioritySelector } from './PrioritySelector';
import { X } from 'lucide-react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export const AddTaskModal: React.FC<Props> = ({ visible, onClose }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const addTask = useTaskStore((state) => state.addTask);

    const handleSave = () => {
        if (title.trim()) {
            addTask(title.trim(), priority);
            setTitle('');
            setPriority('medium');
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.heading}>New Task</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="What needs to be done?"
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
                        cursorColor={colors.text}
                    />

                    <Text style={styles.label}>Priority</Text>
                    <PrioritySelector selected={priority} onSelect={setPriority} />

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>Create Task</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.95)', // White overlay per strict theme? Or opaque?
        // "Strictly black & white". A white overlay with slight transparency or solid white is best.
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.white,
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: 40,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    input: {
        fontSize: 20,
        borderBottomWidth: 2,
        borderBottomColor: colors.text,
        paddingVertical: 8,
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    saveBtn: {
        backgroundColor: colors.text,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 32,
    },
    saveBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
