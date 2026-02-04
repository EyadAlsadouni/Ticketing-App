// app/(app)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useTheme } from '../../../shared/context/ThemeContext';
import { LayoutDashboard, Ticket, Package, Calendar, Menu } from 'lucide-react-native';

export default function TabLayout() {
    const { colors, isDark } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.foreground,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.mutedForeground,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <LayoutDashboard size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tickets"
                options={{
                    title: 'Tickets',
                    tabBarIcon: ({ color, size }) => (
                        <Ticket size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="logs"
                options={{
                    title: 'My Logs',
                    tabBarIcon: ({ color, size }) => (
                        <Calendar size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="inventory"
                options={{
                    title: 'Inventory',
                    tabBarIcon: ({ color, size }) => (
                        <Package size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="more"
                options={{
                    title: 'More',
                    tabBarIcon: ({ color, size }) => (
                        <Menu size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
