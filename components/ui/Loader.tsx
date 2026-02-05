// components/ui/Loader.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle, StyleProp, DimensionValue } from 'react-native';
import { useTheme } from '../../shared/context/ThemeContext';
import { spacing, fontSize } from '../../shared/theme';

interface LoaderProps {
    size?: 'small' | 'large';
    message?: string;
    fullScreen?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function Loader({
    size = 'large',
    message,
    fullScreen = false,
    style,
}: LoaderProps) {
    const { colors } = useTheme();

    const content = (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={colors.primary} />
            {message && (
                <Text style={[styles.message, { color: colors.mutedForeground }]}>
                    {message}
                </Text>
            )}
        </View>
    );

    if (fullScreen) {
        return (
            <View
                style={[
                    styles.fullScreen,
                    { backgroundColor: colors.background },
                ]}
            >
                {content}
            </View>
        );
    }

    return content;
}

// Skeleton loader component
interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}

export function Skeleton({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
}: SkeletonProps) {
    const { colors, isDark } = useTheme();

    return (
        <View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    fullScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        marginTop: spacing.md,
        fontSize: fontSize.sm,
    },
    skeleton: {
        overflow: 'hidden',
    },
});
