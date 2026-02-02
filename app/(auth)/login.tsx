// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../features/auth/store';
import { useTheme } from '../../shared/context/ThemeContext';
import { Button, Input } from '../../components/ui';
import { spacing, fontSize } from '../../shared/theme';

export default function LoginScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { login, isLoading, error } = useAuthStore();

    const [email, setEmail] = useState('admin@ticktraq.com');
    const [password, setPassword] = useState('password');

    const handleLogin = async () => {
        // Basic validation
        if (!email || !password) return;

        const success = await login(email, password);
        // Navigation is handled in the store/redirect or here if needed, 
        // but the store update triggers state change which triggers re-render 
        // and potentially redirect from root if structured that way.
        // However, explicit navigation is safer.
        if (success) {
            // Replace to prevent going back to login
            router.replace('/(app)/(tabs)');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.foreground }]}>
                        Welcome Back
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                        Sign in to continue to TickTraq
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="name@company.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Input
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        secureTextEntry
                    />

                    {error && (
                        <Text style={[styles.errorText, { color: colors.destructive }]}>
                            {error}
                        </Text>
                    )}

                    <Button
                        onPress={handleLogin}
                        isLoading={isLoading}
                        style={styles.loginButton}
                    >
                        Sign In
                    </Button>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
                        Monitoring • Tracking • Analytics
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: spacing.xl,
        justifyContent: 'center',
    },
    header: {
        marginBottom: spacing['4xl'],
        alignItems: 'center',
    },
    title: {
        fontSize: fontSize['3xl'],
        fontWeight: 'bold',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: fontSize.base,
    },
    form: {
        width: '100%',
    },
    loginButton: {
        marginTop: spacing.md,
    },
    errorText: {
        marginBottom: spacing.md,
        fontSize: fontSize.sm,
        textAlign: 'center',
    },
    footer: {
        marginTop: spacing['2xl'],
        alignItems: 'center',
    },
    footerText: {
        fontSize: fontSize.xs,
    },
});
