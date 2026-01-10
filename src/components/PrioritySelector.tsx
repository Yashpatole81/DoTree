import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Priority } from '../types';

interface Props {
    selected: Priority;
    onSelect: (p: Priority) => void;
}

export const PrioritySelector: React.FC<Props> = ({ selected, onSelect }) => {
    const options: Priority[] = ['low', 'medium', 'high'];

    return (
        <View style={styles.container}>
            {options.map((p) => (
                <TouchableOpacity
                    key={p}
                    style={[
                        styles.circle,
                        { backgroundColor: colors.priority[p] },
                        selected === p && styles.selected,
                    ]}
                    onPress={() => onSelect(p)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12, // React Native 0.71+ supports gap
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    selected: {
        borderWidth: 2,
        borderColor: colors.text,
        transform: [{ scale: 1.1 }],
    },
});
