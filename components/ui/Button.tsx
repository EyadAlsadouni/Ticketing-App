// components/ui/Button.tsx
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../shared/context/ThemeContext';
import { borderRadius, spacing } from '../../shared/theme';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = 'default',
    size = 'default',
    isLoading = false,
    children,
    disabled,
    style,
    ...props
}: ButtonProps) {
    const { colors } = useTheme();

    const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (variant) {
            case 'destructive':
                return {
                    container: {
                        backgroundColor: colors.destructive,
                    },
                    text: {
                        color: colors.destructiveForeground,
                    },
                };
            case 'outline':
                return {
                    container: {
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        borderColor: colors.border,
                    },
                    text: {
                        color: colors.foreground,
                    },
                };
            case 'secondary':
                return {
                    container: {
                        backgroundColor: colors.secondary,
                    },
                    text: {
                        color: colors.secondaryForeground,
                    },
                };
            case 'ghost':
                return {
                    container: {
                        backgroundColor: 'transparent',
                    },
                    text: {
                        color: colors.foreground,
                    },
                };
            default:
                return {
                    container: {
                        backgroundColor: colors.primary,
                    },
                    text: {
                        color: colors.primaryForeground,
                    },
                };
        }
    };

    const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (size) {
            case 'sm':
                return {
                    container: {
                        height: 36,
                        paddingHorizontal: spacing.md,
                    },
                    text: {
                        fontSize: 14,
                    },
                };
            case 'lg':
                return {
                    container: {
                        height: 48,
                        paddingHorizontal: spacing.xl,
                    },
                    text: {
                        fontSize: 18,
                    },
                };
            case 'icon':
                return {
                    container: {
                        width: 40,
                        height: 40,
                        paddingHorizontal: 0,
                    },
                    text: {
                        fontSize: 16,
                    },
                };
            default:
                return {
                    container: {
                        height: 44,
                        paddingHorizontal: spacing.lg,
                    },
                    text: {
                        fontSize: 16,
                    },
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <TouchableOpacity
            style={[
                styles.container,
                variantStyles.container,
                sizeStyles.container,
                disabled && styles.disabled,
                style,
            ]}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={variantStyles.text.color} size="small" />
            ) : typeof children === 'string' ? (
                <Text style={[styles.text, variantStyles.text, sizeStyles.text]}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    text: {
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
});
