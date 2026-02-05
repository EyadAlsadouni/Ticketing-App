// components/ui/Card.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StyleProp } from 'react-native';
import { useTheme } from '../../shared/context/ThemeContext';
import { borderRadius, spacing } from '../../shared/theme';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'outlined';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
    const { colors, isDark } = useTheme();

    const getShadow = (): ViewStyle => {
        if (variant === 'outlined' || isDark) {
            return {};
        }
        return Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
            default: {},
        }) as ViewStyle;
    };

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
                variant === 'outlined' && styles.outlined,
                getShadow(),
                style,
            ]}
        >
            {children}
        </View>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function CardHeader({ children, style }: CardHeaderProps) {
    const { colors } = useTheme();
    return (
        <View
            style={[
                styles.header,
                { borderBottomColor: colors.border },
                style,
            ]}
        >
            {children}
        </View>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function CardContent({ children, style }: CardContentProps) {
    return <View style={[styles.content, style]}>{children}</View>;
}

interface CardFooterProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function CardFooter({ children, style }: CardFooterProps) {
    const { colors } = useTheme();
    return (
        <View
            style={[
                styles.footer,
                { borderTopColor: colors.border },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        overflow: 'hidden',
    },
    outlined: {
        backgroundColor: 'transparent',
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    content: {
        padding: spacing.lg,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
