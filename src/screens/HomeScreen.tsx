import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '../store/useTaskStore';
import { TaskItem } from '../components/TaskItem';
import { colors } from '../theme/colors';
import { Plus } from 'lucide-react-native';
import { AddTaskModal } from '../components/AddTaskModal';

import Logo from '../../assets/logo.svg';

export const HomeScreen: React.FC = () => {
    const { tasks } = useTaskStore();
    const [modalVisible, setModalVisible] = useState(false);

    // Sort tasks? Spec: "Main task properties: Title, Priority color, Completion status".
    // Usually incomplete first.
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        return b.createdAt - a.createdAt;
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.logoRow}>
                        <Logo width={32} height={32} color={colors.text} />
                        <Text style={styles.title}>DoTree</Text>
                    </View>
                    <Text style={styles.subtitle}>{tasks.filter(t => !t.isCompleted).length} tasks pending</Text>
                </View>

                <ScrollView contentContainerStyle={styles.list}>
                    {sortedTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                    {sortedTasks.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No tasks yet.</Text>
                            <Text style={styles.emptySubText}>Tap + to start.</Text>
                        </View>
                    )}
                </ScrollView>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Plus size={32} color={colors.white} />
                </TouchableOpacity>

                <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 4,
    },
    list: {
        paddingBottom: 100,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.text,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: colors.text,
        fontWeight: '500',
    },
    emptySubText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 8,
    }
});
