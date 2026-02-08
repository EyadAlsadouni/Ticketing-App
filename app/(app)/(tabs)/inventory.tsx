// app/(app)/(tabs)/inventory.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../shared/context/ThemeContext';
import { Card } from '../../../components/ui/Card';
import { spacing, fontSize, borderRadius } from '../../../shared/theme';
import { PackagePlus, PackageSearch, RotateCcw, ChevronRight } from 'lucide-react-native';

const CATEGORIES = [
    {
        id: 'request',
        title: 'Inventory Request',
        description: 'Request new parts and tools for maintenance and repairs.',
        icon: PackagePlus,
        route: '/inventory_request',
        color: '#2563EB', // Blue
    },
    {
        id: 'received',
        title: 'Inventory Received',
        description: 'Log and verify parts received from suppliers or central warehouse.',
        icon: PackageSearch,
        route: '/inventory_received',
        color: '#10B981', // Green
    },
    {
        id: 'return',
        title: 'Inventory Return',
        description: 'Process and track returns of unused or defective inventory.',
        icon: RotateCcw,
        route: '/inventory_return',
        color: '#F97316', // Orange
    },
];

export default function InventoryScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.foreground }]}>Inventory Management</Text>
                <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                    Select a section to manage your parts and assets
                </Text>
            </View>

            <View style={styles.grid}>
                {CATEGORIES.map((item) => {
                    const Icon = item.icon;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.7}
                            onPress={() => router.push(item.route as any)}
                        >
                            <Card style={styles.menuCard}>
                                <View style={styles.cardContent}>
                                    <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                                        <Icon size={24} color={item.color} />
                                    </View>

                                    <View style={styles.textContainer}>
                                        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                                            {item.title}
                                        </Text>
                                        <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>
                                            {item.description}
                                        </Text>
                                    </View>

                                    <ChevronRight size={20} color={colors.mutedForeground} />
                                </View>
                            </Card>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: spacing.xl,
        paddingBottom: spacing.lg,
    },
    title: {
        fontSize: fontSize['2xl'],
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: fontSize.sm,
    },
    grid: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    menuCard: {
        padding: spacing.lg,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: fontSize.lg,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: fontSize.xs,
        lineHeight: 18,
    },
});
