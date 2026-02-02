// features/tickets/components/TicketCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Clock, MessageSquare, Paperclip } from 'lucide-react-native';
import { Ticket } from '../types';
import { useTheme } from '../../../shared/context/ThemeContext';
import { Card } from '../../../components/ui/Card';
import { Badge, StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { spacing, fontSize, borderRadius } from '../../../shared/theme';
import { format } from 'date-fns';

interface TicketCardProps {
    ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
    const router = useRouter();
    const { colors } = useTheme();

    const handlePress = () => {
        router.push(`/tickets/${ticket.id}`);
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <Card style={styles.card}>
                {/* Header: ID and Priority */}
                <View style={styles.header}>
                    <Text style={[styles.ticketId, { color: colors.mutedForeground }]}>
                        {ticket.ticketId}
                    </Text>
                    <PriorityBadge priority={ticket.priority} />
                </View>

                {/* Title and Description */}
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
                        {ticket.title}
                    </Text>
                    <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
                        {ticket.description}
                    </Text>
                </View>

                {/* Details Row */}
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <MapPin size={14} color={colors.mutedForeground} />
                        <Text style={[styles.detailText, { color: colors.mutedForeground }]}>
                            {ticket.city}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Calendar size={14} color={colors.mutedForeground} />
                        <Text style={[styles.detailText, { color: colors.mutedForeground }]}>
                            {format(new Date(ticket.createdAt), 'MMM d')}
                        </Text>
                    </View>
                    {ticket.projectName && (
                        <View style={styles.detailItem}>
                            <Badge variant="outline" style={styles.projectBadge}>
                                {ticket.projectName}
                            </Badge>
                        </View>
                    )}
                </View>

                {/* Footer: Status and Meta */}
                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <StatusBadge status={ticket.status} />

                    <View style={styles.metaContainer}>
                        {ticket.slaStatus === 'breached' && (
                            <View style={styles.slaBadge}>
                                <Clock size={14} color={colors.destructive} />
                                <Text style={[styles.slaText, { color: colors.destructive }]}>SLA</Text>
                            </View>
                        )}

                        {ticket.commentsCount > 0 && (
                            <View style={styles.iconMeta}>
                                <MessageSquare size={16} color={colors.mutedForeground} />
                                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                                    {ticket.commentsCount}
                                </Text>
                            </View>
                        )}

                        {ticket.attachmentsCount > 0 && (
                            <View style={styles.iconMeta}>
                                <Paperclip size={16} color={colors.mutedForeground} />
                                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                                    {ticket.attachmentsCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.md,
        padding: 0, // Override default padding to control layout manually
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xs,
    },
    ticketId: {
        fontSize: fontSize.xs,
        fontWeight: '500',
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: fontSize.sm,
        lineHeight: 20,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        gap: spacing.lg,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: fontSize.xs,
    },
    projectBadge: {
        paddingVertical: 0,
        height: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: 1,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
    },
    slaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    slaText: {
        fontSize: fontSize.xs,
        fontWeight: '700',
    },
    iconMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: fontSize.xs,
        fontWeight: '500',
    },
});
