// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AppLayout() {
    // Removed auth checks to bypass login
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="tickets/[id]" options={{ presentation: 'card', headerShown: true }} />
        </Stack>
    );
}
