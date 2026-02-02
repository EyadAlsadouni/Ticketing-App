// components/ui/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '../../shared/context/ThemeContext';
import { borderRadius, spacing, fontSize } from '../../shared/theme';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    style?: ViewStyle;
}

export function SearchBar({
    value,
    onChangeText,
    placeholder = 'Search...',
    onClear,
    style,
}: SearchBarProps) {
    const { colors } = useTheme();

    const handleClear = () => {
        onChangeText('');
        onClear?.();
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                },
                style,
            ]}
        >
            <Search
                size={20}
                color={colors.mutedForeground}
                style={styles.searchIcon}
            />
            <TextInput
                style={[
                    styles.input,
                    { color: colors.foreground },
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="search"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <X size={18} color={colors.mutedForeground} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.full,
        borderWidth: 1,
        paddingHorizontal: spacing.md,
        height: 44,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: fontSize.base,
        paddingVertical: spacing.sm,
    },
    clearButton: {
        padding: spacing.xs,
    },
});
