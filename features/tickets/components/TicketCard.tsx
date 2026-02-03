// features/tickets/components/TicketCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Clock, History, Check } from 'lucide-react-native';
import { Ticket } from '../types';
import { useTheme } from '../../../shared/context/ThemeContext';
import { Card } from '../../../components/ui/Card';
import { Badge, StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { spacing, fontSize, borderRadius } from '../../../shared/theme';
import { format } from 'date-fns';

interface TicketCardProps {
    ticket: Ticket;
    selectionMode?: boolean;
    selected?: boolean;
    onSelect?: () => void;
    onLongPress?: () => void;
}

export function TicketCard({ ticket, selectionMode, selected, onSelect, onLongPress }: TicketCardProps) {
    const router = useRouter();
    const { colors } = useTheme();

    const handleCardPress = () => {
        router.push(`/tickets/${ticket.id}?tab=details`);
    };

    const handleHistoryPress = () => {
        router.push(`/tickets/${ticket.id}?tab=history`);
    };

    const getRelevantDate = () => {
        if (ticket.completedDate) {
            return { label: 'Completed', date: ticket.completedDate };
        }
        if (ticket.suspendedDate) {
            return { label: 'Suspended', date: ticket.suspendedDate };
        }
        if (ticket.startDate) {
            return { label: 'Started', date: ticket.startDate };
        }
        return { label: 'Created', date: ticket.createdAt };
    };

    const dateInfo = getRelevantDate();
    const isClosed = ticket.status === 'closed';

    return (
        <TouchableOpacity
            onPress={selectionMode ? onSelect : handleCardPress}
            onLongPress={isClosed ? undefined : onLongPress}
            activeOpacity={0.7}
            disabled={isClosed && selectionMode} // Disable interaction if closed in selection mode
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Selection Checkbox */}
                {selectionMode && (
                    <View style={{ marginRight: 12, marginLeft: 4 }}>
                        {isClosed ? (
                            <View style={[styles.checkbox, { borderColor: colors.border, backgroundColor: colors.border }]} />
                        ) : (
                            <View style={[
                                styles.checkbox,
                                { borderColor: selected ? colors.primary : colors.mutedForeground },
                                selected && { backgroundColor: colors.primary }
                            ]}>
                                {selected && <Check size={14} color="#fff" />}
                            </View>
                        )}
                    </View>
                )}

                <Card style={{ ...styles.card, flex: 1 }}>
                    <View style={styles.container}>
                        {/* Left Column: ID & Basic Info */}
                        <View style={styles.leftCol}>
                            <Text style={[styles.ticketId, { color: colors.primary }]}>{ticket.ticketId}</Text>

                            {/* Title - Full Width, No Truncation */}
                            {ticket.title ? (
                                <Text style={[styles.briefTitle, { color: colors.foreground }]}>
                                    {ticket.title}
                                </Text>
                            ) : null}
                        </View>

                        {/* Middle Column: Tags & Location */}
                        <View style={styles.midCol}>
                            <View style={styles.tagsRow}>
                                {ticket.type && (
                                    <Badge variant="outline" style={styles.miniBadge}>{ticket.type}</Badge>
                                )}
                                <PriorityBadge priority={ticket.priority} style={styles.miniBadge} />
                            </View>
                            <Text style={[styles.locationText, { color: colors.foreground }]} numberOfLines={2}>
                                {ticket.locationDetails || ticket.siteName}
                            </Text>
                        </View>

                        {/* Right Column: Date & Status */}
                        <View style={styles.rightCol}>
                            <View style={styles.dateContainer}>
                                <Text style={[styles.dateLabel, { color: colors.mutedForeground }]}>
                                    {dateInfo.label} Date
                                </Text>
                                <Text style={[styles.dateValue, { color: colors.foreground }]}>
                                    {format(new Date(dateInfo.date), 'MMM d, h:mm a')}
                                </Text>
                            </View>

                            {/* Status below Date, Approval below Status */}
                            <View style={styles.statusContainer}>
                                <StatusBadge status={ticket.status} style={styles.statusBadge} />
                                {ticket.approvalStatus && (
                                    <Badge variant="success" style={styles.statusBadge}>
                                        {ticket.approvalStatus === 'approved' ? 'Approved' : ticket.approvalStatus}
                                    </Badge>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Footer Actions */}
                    <View style={[styles.footer, { borderTopColor: colors.border }]}>
                        <View style={styles.footerLeft}>
                            <Clock size={14} color={colors.mutedForeground} />
                            <Text style={[styles.delayText, { color: colors.mutedForeground }]}>
                                {ticket.delayDays} days delay
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.historyBtn} onPress={handleHistoryPress}>
                            <History size={16} color={colors.primary} />
                            <Text style={[styles.historyText, { color: colors.primary }]}>History</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.md,
        padding: 0,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.sm,
    },
    leftCol: {
        flex: 2,
        gap: 6,
    },
    midCol: {
        flex: 3,
        paddingHorizontal: 4,
        gap: 8,
    },
    rightCol: {
        flex: 3,
        alignItems: 'flex-end',
        gap: 2,
    },
    ticketId: {
        fontSize: fontSize.sm,
        fontWeight: 'bold',
    },
    briefTitle: {
        fontSize: fontSize.sm,
        fontWeight: '500',
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 4,
        flexWrap: 'wrap'
    },
    miniBadge: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        minHeight: 22
    },
    locationText: {
        fontSize: fontSize.xs,
        fontWeight: '500'
    },
    dateContainer: {
        alignItems: 'flex-end'
    },
    dateLabel: {
        fontSize: 10,
    },
    dateValue: {
        fontSize: 10,
        fontWeight: '600'
    },
    statusContainer: {
        alignItems: 'flex-end',
        marginTop: 4,
        gap: 4
    },
    statusBadge: {
        paddingVertical: 4
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    delayText: {
        fontSize: fontSize.xs
    },
    historyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        gap: 4
    },
    historyText: {
        fontSize: fontSize.xs,
        fontWeight: '500'
    }
});
