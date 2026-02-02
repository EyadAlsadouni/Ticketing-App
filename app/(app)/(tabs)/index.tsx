// app/(app)/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, RefreshControl, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../../shared/context/ThemeContext';
import { useTicketsStore } from '../../../features/tickets/store';
import { Card } from '../../../components/ui/Card';
import { spacing, fontSize, borderRadius } from '../../../shared/theme';
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
    const { colors, isDark } = useTheme();
    const { stats, slaStats, weeklyPerformance, fetchTickets, isLoading } = useTicketsStore();
    const [refreshing, setRefreshing] = useState(false);
    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        fetchTickets();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTickets();
        setRefreshing(false);
    };

    const chartConfig = {
        backgroundGradientFrom: isDark ? "#262626" : "#ffffff",
        backgroundGradientTo: isDark ? "#262626" : "#ffffff",
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Primary blue
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={[styles.pageTitle, { color: colors.foreground }]}>Engineer Dashboard</Text>
                <Text style={[styles.lastUpdated, { color: colors.mutedForeground }]}>
                    Pull to refresh • Latest updates
                </Text>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Overview</Text>

            <View style={styles.metricsGrid}>
                <MetricCard
                    title="Total Tickets"
                    value={stats.total}
                    color={chartColors.blue}
                    label="Assigned to you"
                />
                <MetricCard
                    title="Open"
                    value={stats.open}
                    color={chartColors.orange}
                    label="Needs attention"
                />
                <MetricCard
                    title="Resolved"
                    value={stats.closed}
                    color={chartColors.green}
                    label="This month"
                />
                <MetricCard
                    title="Pending"
                    value={stats.pending}
                    color={chartColors.violet}
                    label="Waiting on others"
                />
            </View>

            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: spacing.xl }]}>
                SLA Compliance
            </Text>

            <Card style={styles.chartCard}>
                {slaStats && slaStats.length > 0 ? (
                    <PieChart
                        data={slaStats.map(item => ({
                            ...item,
                            legendFontColor: colors.mutedForeground,
                        }))}
                        width={screenWidth - (spacing.lg * 4)} // Adjust for padding
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"count"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[0, 0]}
                        absolute
                    />
                ) : (
                    <Text style={{ color: colors.mutedForeground }}>No SLA data available</Text>
                )}
            </Card>

            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: spacing.xl }]}>
                Weekly Performance
            </Text>

            <Card style={styles.chartCard}>
                {weeklyPerformance ? (
                    <BarChart
                        data={weeklyPerformance}
                        width={screenWidth - (spacing.lg * 4)}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        showValuesOnTopOfBars
                    />
                ) : (
                    <Text style={{ color: colors.mutedForeground }}>No performance data available</Text>
                )}
            </Card>

            <View style={{ height: 40 }} />
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
    header: {
        marginBottom: spacing.lg,
    },
    pageTitle: {
        fontSize: fontSize['2xl'],
        fontWeight: 'bold',
    },
    lastUpdated: {
        fontSize: fontSize.xs,
        marginTop: 4,
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
        fontSize: fontSize['3xl'],
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    metricLabel: {
        fontSize: fontSize.xs,
    },
    chartCard: {
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Prevent scrollview conflicts
    },
});
