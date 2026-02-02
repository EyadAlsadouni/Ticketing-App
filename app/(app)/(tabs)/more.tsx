// app/(app)/(tabs)/more.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../shared/context/ThemeContext';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../features/auth/store';
import { spacing } from '../../../shared/theme';

export default function MoreScreen() {
    const { colors } = useTheme();
    const { logout } = useAuthStore();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            <Button
                variant="destructive"
                onPress={logout}
            >
                Sign Out
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
    },
});
