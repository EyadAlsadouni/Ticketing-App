// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
    // Bypass login completely for now
    return <Redirect href="/(app)/(tabs)" />;
}
