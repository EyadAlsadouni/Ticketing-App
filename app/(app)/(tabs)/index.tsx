// app/(app)/(tabs)/index.tsx
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, RefreshControl } from 'react-native';
import { useTheme } from '../../../shared/context/ThemeContext';
import { useTicketsStore } from '../../../features/tickets/store';
import { Card } from '../../../components/ui/Card';
import { spacing, fontSize } from '../../../shared/theme';
import { chartColors } from '../../../shared/theme/colors';

// Metric Card Component
const MetricCard = ({ title, value, color, label }: { title: string, value: number, color: string, label: string }) => {
    const { colors } = useTheme();
    return (
        <Card style={[styles.metricCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
            <Text style={[styles.metricTitle, { color: colors.foreground }]}>{title}</Text>
            <Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{label}</Text>
        </Card>
    );
};

export default function DashboardScreen() {
    const { colors } = useTheme();
    const { stats, fetchTickets, isLoading } = useTicketsStore();
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTickets();
        setRefreshing(false);
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Overview</Text>

            <View style={styles.metricsGrid}>
                <MetricCard
                    title="Total Tickets"
                    value={stats.total}
                    color={chartColors.blue}
                    label="All time"
                />
                <MetricCard
                    title="Open"
                    value={stats.open}
                    color={chartColors.orange}
                    label="Action required"
                />
                <MetricCard
                    title="Closed"
                    value={stats.closed}
                    color={chartColors.green}
                    label="Completed"
                />
                <MetricCard
                    title="Suspended"
                    value={stats.suspended}
                    color={chartColors.red}
                    label="On hold"
                />
            </View>

            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: spacing.xl }]}>
                SLA Compliance
            </Text>

            <Card style={styles.chartCard}>
                <View style={styles.chartPlaceholder}>
                    <Text style={{ color: colors.mutedForeground }}>Chart Placeholder</Text>
                    {/* Will integrate real charts later */}
                </View>
            </Card>
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
    sectionTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        marginBottom: spacing.md,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    metricCard: {
        width: '48%', // roughly half width with gap
        padding: spacing.md,
        alignItems: 'flex-start',
    },
    metricTitle: {
        fontSize: fontSize.sm,
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    metricValue: {
        fontSize: fontSize['2xl'],
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    metricLabel: {
        fontSize: fontSize.xs,
    },
    chartCard: {
        padding: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    chartPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8
    }
});
