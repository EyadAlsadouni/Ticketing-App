// components/ui/Avatar.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../shared/context/ThemeContext';
import { borderRadius, fontSize } from '../../shared/theme';

interface AvatarProps {
    source?: { uri: string } | null;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    style?: ViewStyle;
}

export function Avatar({ source, name, size = 'md', style }: AvatarProps) {
    const { colors } = useTheme();

    const getSize = () => {
        switch (size) {
            case 'sm':
                return 32;
            case 'md':
                return 40;
            case 'lg':
                return 56;
            case 'xl':
                return 80;
            default:
                return 40;
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'sm':
                return fontSize.xs;
            case 'md':
                return fontSize.sm;
            case 'lg':
                return fontSize.lg;
            case 'xl':
                return fontSize['2xl'];
            default:
                return fontSize.sm;
        }
    };

    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return parts[0]?.substring(0, 2).toUpperCase() || '?';
    };

    const sizeValue = getSize();

    if (source?.uri) {
        return (
            <Image
                source={source}
                style={[
                    styles.image,
                    {
                        width: sizeValue,
                        height: sizeValue,
                        borderRadius: sizeValue / 2,
                    },
                    style,
                ]}
            />
        );
    }

    return (
        <View
            style={[
                styles.fallback,
                {
                    width: sizeValue,
                    height: sizeValue,
                    borderRadius: sizeValue / 2,
                    backgroundColor: colors.primary,
                },
                style,
            ]}
        >
            <Text
                style={[
                    styles.initials,
                    {
                        fontSize: getFontSize(),
                        color: colors.primaryForeground,
                    },
                ]}
            >
                {getInitials(name || 'User')}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        backgroundColor: '#E5E5E5',
    },
    fallback: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        fontWeight: '600',
    },
});
