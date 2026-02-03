// components/ui/Badge.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../shared/context/ThemeContext';
import { borderRadius, spacing, fontSize } from '../../shared/theme';
import { statusColors, priorityColors } from '../../shared/theme/colors';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Badge({
    children,
    variant = 'default',
    style,
    textStyle,
}: BadgeProps) {
    const { colors } = useTheme();

    const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (variant) {
            case 'secondary':
                return {
                    container: {
                        backgroundColor: colors.secondary,
                        borderColor: 'transparent',
                    },
                    text: {
                        color: colors.secondaryForeground,
                    },
                };
            case 'destructive':
                return {
                    container: {
                        backgroundColor: colors.destructive,
                        borderColor: 'transparent',
                    },
                    text: {
                        color: colors.destructiveForeground,
                    },
                };
            case 'outline':
                return {
                    container: {
                        backgroundColor: 'transparent',
                        borderColor: colors.border,
                        borderWidth: 1,
                    },
                    text: {
                        color: colors.foreground,
                    },
                };
            case 'success':
                return {
                    container: {
                        backgroundColor: `${colors.success}20`,
                        borderColor: 'transparent',
                    },
                    text: {
                        color: colors.success,
                    },
                };
            case 'warning':
                return {
                    container: {
                        backgroundColor: `${colors.warning}20`,
                        borderColor: 'transparent',
                    },
                    text: {
                        color: colors.warning,
                    },
                };
            default:
                return {
                    container: {
                        backgroundColor: colors.primary,
                        borderColor: 'transparent',
                    },
                    text: {
                        color: colors.primaryForeground,
                    },
                };
        }
    };

    const variantStyles = getVariantStyles();

    return (
        <View style={[styles.container, variantStyles.container, style]}>
            <Text style={[styles.text, variantStyles.text, textStyle]}>
                {children}
            </Text>
        </View>
    );
}

// Status Badge for tickets
interface StatusBadgeProps {
    status: 'open' | 'inProgress' | 'closed' | 'suspended' | 'pending';
    style?: ViewStyle;
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'open':
                return { label: 'Open', color: statusColors.open };
            case 'inProgress':
                return { label: 'In Progress', color: statusColors.inProgress };
            case 'closed':
                return { label: 'Closed', color: statusColors.closed };
            case 'suspended':
                return { label: 'Suspended', color: statusColors.suspended };
            case 'pending':
                return { label: 'Pending', color: statusColors.pending };
            default:
                return { label: status, color: statusColors.open };
        }
    };

    const config = getStatusConfig();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: `${config.color}20` },
                style,
            ]}
        >
            <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
        </View>
    );
}

// Priority Badge for tickets
interface PriorityBadgeProps {
    priority: 'critical' | 'high' | 'medium' | 'low';
    style?: ViewStyle;
}

export function PriorityBadge({ priority, style }: PriorityBadgeProps) {
    const getPriorityConfig = () => {
        switch (priority) {
            case 'critical':
                return { label: 'Critical', color: priorityColors.critical };
            case 'high':
                return { label: 'High', color: priorityColors.high };
            case 'medium':
                return { label: 'Medium', color: priorityColors.medium };
            case 'low':
                return { label: 'Low', color: priorityColors.low };
            default:
                return { label: priority, color: priorityColors.medium };
        }
    };

    const config = getPriorityConfig();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: `${config.color}20` },
                style,
            ]}
        >
            <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4, // Increased padding
        minHeight: 24, // Minimum height to prevent cutoff
        borderRadius: borderRadius.md,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: fontSize.xs,
        fontWeight: '600',
    },
});
