// components/ui/Input.tsx
import React, { forwardRef } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    StyleProp,
    TextStyle,
} from 'react-native';
import { useTheme } from '../../shared/context/ThemeContext';
import { borderRadius, spacing, fontSize } from '../../shared/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<TextStyle>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
    ({ label, error, containerStyle, leftIcon, rightIcon, style, ...props }, ref) => {
        const { colors } = useTheme();

        return (
            <View style={[styles.container, containerStyle]}>
                {label && (
                    <Text style={[styles.label, { color: colors.foreground }]}>
                        {label}
                    </Text>
                )}
                <View
                    style={[
                        styles.inputContainer,
                        {
                            backgroundColor: colors.background,
                            borderColor: error ? colors.destructive : colors.border,
                        },
                    ]}
                >
                    {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                    <TextInput
                        ref={ref}
                        style={[
                            styles.input,
                            {
                                color: colors.foreground,
                            },
                            leftIcon ? styles.inputWithLeftIcon : null,
                            rightIcon ? styles.inputWithRightIcon : null,
                            style,
                        ]}
                        placeholderTextColor={colors.mutedForeground}
                        {...props}
                    />
                    {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
                </View>
                {error && (
                    <Text style={[styles.error, { color: colors.destructive }]}>
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: fontSize.sm,
        fontWeight: '500',
        marginBottom: spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        minHeight: 48,
    },
    input: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        fontSize: fontSize.base,
    },
    inputWithLeftIcon: {
        paddingLeft: spacing.sm,
    },
    inputWithRightIcon: {
        paddingRight: spacing.sm,
    },
    iconLeft: {
        paddingLeft: spacing.md,
    },
    iconRight: {
        paddingRight: spacing.md,
    },
    error: {
        fontSize: fontSize.xs,
        marginTop: spacing.xs,
    },
});
