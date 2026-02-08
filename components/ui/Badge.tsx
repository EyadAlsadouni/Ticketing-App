import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../shared/context/ThemeContext';
import { borderRadius, spacing, fontSize } from '../../shared/theme';
import { statusColors, priorityColors } from '../../shared/theme/colors';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    style?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
}

export function Badge({
    children,
    variant = 'default',
    size = 'md',
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
            case 'info':
                return {
                    container: {
                        backgroundColor: '#E0F2FE', // Light blue/info
                        borderColor: 'transparent',
                    },
                    text: {
                        color: '#0369A1', // Dark blue/info
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

    const getSizeStyles = () => {
        switch (size) {
            case 'xs':
                return {
                    container: { paddingHorizontal: 4, paddingVertical: 1, minHeight: 16 },
                    text: { fontSize: 8 },
                };
            case 'sm':
                return {
                    container: { paddingHorizontal: 6, paddingVertical: 2, minHeight: 20 },
                    text: { fontSize: 10 },
                };
            case 'lg':
                return {
                    container: { paddingHorizontal: 12, paddingVertical: 6, minHeight: 32 },
                    text: { fontSize: fontSize.sm },
                };
            default:
                return {
                    container: { paddingHorizontal: spacing.sm, paddingVertical: 4, minHeight: 24 },
                    text: { fontSize: fontSize.xs },
                };
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <View style={[styles.container, variantStyles.container, sizeStyles.container, style]}>
            <Text style={[styles.text, variantStyles.text, sizeStyles.text, textStyle]}>
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
