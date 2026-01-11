import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Priority } from '../types';

interface Props {
    selected: Priority;
    onSelect: (p: Priority) => void;
    selectedBorderColor?: string; // Optional border color for selected state
}

export const PrioritySelector: React.FC<Props> = ({ selected, onSelect, selectedBorderColor = colors.text }) => {
    const options: Priority[] = ['low', 'medium', 'high'];

    return (
        <View style={styles.container}>
            {options.map((p) => (
                <TouchableOpacity
                    key={p}
                    style={[
                        styles.circle,
                        { backgroundColor: colors.priority[p] },
                        selected === p && {
                            borderWidth: 2,
                            borderColor: selectedBorderColor,
                            transform: [{ scale: 1.1 }],
                        },
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
        width: 48,
        height: 24,
        borderRadius: 12,
    },
    selected: {
        borderWidth: 2,
        borderColor: colors.white, // Changed from colors.text to visible on black background
        transform: [{ scale: 1.1 }],
    },
});
