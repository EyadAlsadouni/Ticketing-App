// app/(app)/tickets/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '../../../shared/context/ThemeContext';
import { useTicketsStore } from '../../../features/tickets/store';
import { Ticket } from '../../../features/tickets/types';
import { Badge, StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Loader } from '../../../components/ui/Loader';
import { spacing, fontSize } from '../../../shared/theme';
import { MapPin, Calendar, Clock, User, Briefcase } from 'lucide-react-native';
import { format } from 'date-fns';

export default function TicketDetailScreen() {
    const { id } = useLocalSearchParams();
    const { getTicketById } = useTicketsStore();
    const { colors } = useTheme();

    const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const foundTicket = getTicketById(Number(id));
            setTicket(foundTicket);
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!ticket) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.foreground }}>Ticket not found</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen
                options={{
                    title: ticket.ticketId,
                    headerBackTitle: 'Tickets',
                }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.foreground }]}>{ticket.title}</Text>
                    <View style={styles.badgesRow}>
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                        {ticket.projectName && (
                            <Badge variant="outline">{ticket.projectName}</Badge>
                        )}
                    </View>
                </View>

                {/* Location Card */}
                <Card style={styles.sectionCard}>
                    <View style={styles.row}>
                        <MapPin size={20} color={colors.primary} />
                        <View style={styles.rowContent}>
                            <Text style={[styles.label, { color: colors.mutedForeground }]}>Location</Text>
                            <Text style={[styles.value, { color: colors.foreground }]}>
                                {ticket.siteName}, {ticket.city}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* People Card */}
                <Card style={styles.sectionCard}>
                    <View style={[styles.row, { marginBottom: spacing.lg }]}>
                        <User size={20} color={colors.primary} />
                        <View style={styles.rowContent}>
                            <Text style={[styles.label, { color: colors.mutedForeground }]}>Reported By</Text>
                            <View style={styles.userRow}>
                                <Avatar name={ticket.reporter.name} size="sm" />
                                <Text style={[styles.value, { color: colors.foreground }]}>{ticket.reporter.name}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Briefcase size={20} color={colors.primary} />
                        <View style={styles.rowContent}>
                            <Text style={[styles.label, { color: colors.mutedForeground }]}>Assigned To</Text>
                            {ticket.assignee ? (
                                <View style={styles.userRow}>
                                    <Avatar name={ticket.assignee.name} size="sm" />
                                    <Text style={[styles.value, { color: colors.foreground }]}>{ticket.assignee.name}</Text>
                                </View>
                            ) : (
                                <Text style={[styles.value, { color: colors.mutedForeground, fontStyle: 'italic' }]}>
                                    Unassigned
                                </Text>
                            )}
                        </View>
                    </View>
                </Card>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Description</Text>
                    <Text style={[styles.description, { color: colors.secondaryForeground }]}>
                        {ticket.description}
                    </Text>
                </View>

                {/* Dates */}
                <View style={styles.metaSection}>
                    <View style={styles.metaItem}>
                        <Calendar size={16} color={colors.mutedForeground} />
                        <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                            Created: {format(new Date(ticket.createdAt), 'PPp')}
                        </Text>
                    </View>
                    {ticket.dueDate && (
                        <View style={styles.metaItem}>
                            <Clock size={16} color={colors.mutedForeground} />
                            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                                Due: {format(new Date(ticket.dueDate), 'PPp')}
                            </Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: fontSize['2xl'],
        fontWeight: 'bold',
        marginBottom: spacing.md,
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    sectionCard: {
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    rowContent: {
        flex: 1,
    },
    label: {
        fontSize: fontSize.xs,
        fontWeight: '500',
        marginBottom: 4,
    },
    value: {
        fontSize: fontSize.base,
        fontWeight: '500',
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginTop: 4,
    },
    section: {
        marginTop: spacing.md,
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: fontSize.base,
        lineHeight: 24,
    },
    metaSection: {
        gap: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        paddingTop: spacing.lg,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    metaText: {
        fontSize: fontSize.sm,
    },
});
