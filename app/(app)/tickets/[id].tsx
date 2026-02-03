// app/(app)/tickets/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTicketsStore } from '../../../features/tickets/store';
import { useTheme } from '../../../shared/context/ThemeContext';
import { Card } from '../../../components/ui/Card';
import { Badge, StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import {
    MapPin, Calendar, Clock, User, FileText,
    Package, Activity as ActivityIcon, AlertCircle, CheckCircle, X,
    ChevronDown, ChevronUp, Paperclip, Download, Info, History
} from 'lucide-react-native';
import { spacing, fontSize, borderRadius } from '../../../shared/theme';
import { format } from 'date-fns';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function TicketDetailScreen() {
    const { id, tab } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useTheme();
    const { getTicketById, updateTicketStatus } = useTicketsStore();

    const [ticket, setTicket] = useState<any>(null);
    const [statusModalVisible, setStatusModalVisible] = useState(false);

    const isHistoryView = tab === 'history';

    const [collapsedSections, setCollapsedSections] = useState({
        location: false,
        dates: false,
    });

    const toggleSection = (key: 'location' | 'dates') => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    useEffect(() => {
        if (id) {
            const foundTicket = getTicketById(Number(id));
            if (foundTicket) {
                setTicket(foundTicket);
            } else {
                router.back();
            }
        }
    }, [id]);

    if (!ticket) return null;

    const handleStatusChange = async (newStatus: string) => {
        await updateTicketStatus(ticket.id, newStatus);
        setTicket({ ...ticket, status: newStatus as any });
        setStatusModalVisible(false);
    };

    const getStatusOptions = () => [
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'inProgress' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Pending for Approval', value: 'pending' },
    ];

    const InfoRow = ({ icon: Icon, label, value }: any) => (
        <View style={styles.infoRow}>
            <Icon size={16} color={colors.mutedForeground} />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}:</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]} numberOfLines={2}>
                {value}
            </Text>
        </View>
    );

    const SectionHeader = ({ title, icon: Icon }: any) => (
        <View style={styles.sectionHeaderPlain}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {Icon && <Icon size={20} color={colors.primary} />}
                <Text style={[styles.plainSectionTitle, { color: colors.foreground }]}>{title}</Text>
            </View>
        </View>
    );

    return (
        <>
            <Stack.Screen options={{
                title: isHistoryView ? `Ticket History #${ticket.ticketId}` : `Ticket ${ticket.ticketId}`,
                headerRight: () => !isHistoryView ? (
                    <TouchableOpacity
                        onPress={() => setStatusModalVisible(true)}
                        style={{ marginRight: 8 }}
                    >
                        <Badge variant="default">Change Status</Badge>
                    </TouchableOpacity>
                ) : null
            }} />

            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

                {/* Common Header Card */}
                <Card style={styles.headerCard}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={[styles.ticketTitle, { color: colors.foreground }]}>
                                {ticket.title || 'Untitled Ticket'}
                            </Text>
                            <Text style={[styles.projectName, { color: colors.mutedForeground }]}>
                                {ticket.projectName}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', gap: 4 }}>
                            <StatusBadge status={ticket.status} />
                            <PriorityBadge priority={ticket.priority} />
                        </View>
                    </View>

                    <View style={styles.badgesRow}>
                        {ticket.type && <Badge variant="secondary">{ticket.type}</Badge>}
                        <Badge variant={ticket.slaStatus === 'met' ? 'success' : 'destructive'}>
                            SLA: {ticket.slaStatus === 'met' ? 'MET' : ticket.slaStatus.toUpperCase()}
                        </Badge>
                    </View>

                    {ticket.approvalStatus && (
                        <View style={[styles.approvalBanner, { backgroundColor: ticket.approvalStatus === 'approved' ? '#dcfce7' : '#fee2e2' }]}>
                            {ticket.approvalStatus === 'approved' ? (
                                <CheckCircle size={16} color="#166534" />
                            ) : (
                                <AlertCircle size={16} color="#991b1b" />
                            )}
                            <Text style={{ color: ticket.approvalStatus === 'approved' ? '#166534' : '#991b1b', fontWeight: '600' }}>
                                Approval: {ticket.approvalStatus.toUpperCase()}
                            </Text>
                        </View>
                    )}
                </Card>

                {/* -------------------- DETAILS VIEW -------------------- */}
                {!isHistoryView && (
                    <View style={styles.section}>
                        <Card style={styles.collapsibleCard}>
                            <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('location')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MapPin size={18} color={colors.primary} style={{ marginRight: 8 }} />
                                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Location & Contact</Text>
                                </View>
                                {collapsedSections.location ? <ChevronDown size={20} color={colors.mutedForeground} /> : <ChevronUp size={20} color={colors.mutedForeground} />}
                            </TouchableOpacity>
                            {!collapsedSections.location && (
                                <View style={{ marginTop: spacing.sm }}>
                                    <InfoRow icon={MapPin} label="Site" value={ticket.siteName} />
                                    <InfoRow icon={MapPin} label="Location" value={ticket.locationDetails || '-'} />
                                    <InfoRow icon={MapPin} label="Region" value={`${ticket.city}, ${ticket.region}`} />
                                    <View style={styles.separator} />
                                    <InfoRow icon={User} label="Reporter" value={ticket.reporter.name} />
                                    <InfoRow icon={User} label="Assignee" value={ticket.assignee?.name} />
                                </View>
                            )}
                        </Card>

                        <Card style={styles.collapsibleCard}>
                            <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('dates')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Calendar size={18} color={colors.primary} style={{ marginRight: 8 }} />
                                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Dates & Timing</Text>
                                </View>
                                {collapsedSections.dates ? <ChevronDown size={20} color={colors.mutedForeground} /> : <ChevronUp size={20} color={colors.mutedForeground} />}
                            </TouchableOpacity>
                            {!collapsedSections.dates && (
                                <View style={{ marginTop: spacing.sm }}>
                                    <InfoRow icon={Calendar} label="Created" value={format(new Date(ticket.createdAt), 'PP p')} />
                                    {ticket.startDate && <InfoRow icon={Clock} label="Started" value={format(new Date(ticket.startDate), 'PP p')} />}
                                    {ticket.suspendedDate && <InfoRow icon={AlertCircle} label="Suspended" value={format(new Date(ticket.suspendedDate), 'PP p')} />}
                                    {ticket.completedDate && <InfoRow icon={CheckCircle} label="Completed" value={format(new Date(ticket.completedDate), 'PP p')} />}
                                    <InfoRow icon={Clock} label="Delay" value={`${ticket.delayDays} days`} />
                                </View>
                            )}
                        </Card>

                        <Card style={{ marginTop: spacing.md }}>
                            <View style={styles.sectionHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FileText size={18} color={colors.primary} style={{ marginRight: 8 }} />
                                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Description</Text>
                                </View>
                            </View>
                            <Text style={{ color: colors.foreground, lineHeight: 22, fontSize: fontSize.base, marginTop: spacing.sm }}>
                                {ticket.description}
                            </Text>
                        </Card>
                    </View>
                )}

                {/* -------------------- HISTORY VIEW -------------------- */}
                {isHistoryView && (
                    <View style={styles.section}>
                        {/* Attachments Section */}
                        <View style={{ marginBottom: spacing.xl }}>
                            <SectionHeader title="Ticket Attachments" icon={Paperclip} />
                            {ticket.attachments && ticket.attachments.length > 0 ? (
                                ticket.attachments.map((att: any) => (
                                    <Card key={att.id} style={styles.attachmentCard}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <View style={styles.fileIcon}>
                                                <Text style={styles.fileTypeText}>{att.fileSize || 'FILE'}</Text>
                                            </View>
                                            <View style={{ marginLeft: 12, flex: 1 }}>
                                                <Text style={[styles.fileName, { color: colors.foreground }]} numberOfLines={1}>{att.fileName}</Text>
                                                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{att.type} • {format(new Date(att.uploadedDate), 'MMM dd, yyyy')}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity>
                                            <Download size={20} color={colors.primary} />
                                        </TouchableOpacity>
                                    </Card>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}><Text style={styles.emptyText}>No attachments found.</Text></View>
                            )}
                        </View>

                        {/* Dependencies Section */}
                        <View style={{ marginBottom: spacing.xl }}>
                            <SectionHeader title="Ticket Dependencies" icon={Info} />
                            {ticket.dependencies && ticket.dependencies.length > 0 ? (
                                ticket.dependencies.map((dep: any) => (
                                    <Card key={dep.id} style={styles.dependencyCard}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <View style={{ flex: 1, marginRight: 8 }}>
                                                <Text style={[styles.dependencyName, { color: colors.foreground }]}>{dep.name}</Text>
                                                <Text style={[styles.dependencyRemarks, { color: colors.mutedForeground }]}>{dep.remarks}</Text>
                                            </View>
                                            <Badge variant={dep.resolved ? 'success' : 'destructive'}>
                                                {dep.resolved ? 'Yes' : 'No'}
                                            </Badge>
                                        </View>
                                    </Card>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}><Text style={styles.emptyText}>No dependencies found.</Text></View>
                            )}
                        </View>

                        {/* Inventory Section */}
                        <View style={{ marginBottom: spacing.xl }}>
                            <SectionHeader title="Inventory Consumed" icon={Package} />
                            {ticket.inventoryConsumed && ticket.inventoryConsumed.length > 0 ? (
                                ticket.inventoryConsumed.map((item: any) => (
                                    <Card key={item.id} style={styles.inventoryCard}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                            <Text style={[styles.inventoryName, { color: colors.foreground }]}>{item.name}</Text>
                                            <Text style={[styles.inventoryQty, { color: colors.primary }]}>{item.quantity}</Text>
                                        </View>
                                        {item.barcode && <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{item.barcode} | Barcode# {item.desc}</Text>}
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                                            <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Consumed: {format(new Date(item.consumedDate), 'MMM dd, yyyy')}</Text>
                                        </View>
                                    </Card>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}><Text style={styles.emptyText}>No inventory consumed.</Text></View>
                            )}
                        </View>

                        {/* Daily Activity Logs Section */}
                        <View style={{ marginBottom: spacing.xl }}>
                            <SectionHeader title="Daily Activity Logs" icon={ActivityIcon} />
                            {ticket.dailyLogs && ticket.dailyLogs.length > 0 ? (
                                ticket.dailyLogs.map((log: any) => (
                                    <Card key={log.id} style={styles.activityLogCard}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text style={{ fontWeight: 'bold', color: colors.foreground }}>{format(new Date(log.workDate), 'MMM dd, yyyy')}</Text>
                                            <Badge variant="outline">{log.activity}</Badge>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{log.startTime} - {log.endTime}</Text>
                                            <Text style={{ fontWeight: 'bold', color: colors.primary }}>{log.duration}</Text>
                                            <Badge variant="success">{log.status}</Badge>
                                        </View>
                                    </Card>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}><Text style={styles.emptyText}>No logs found.</Text></View>
                            )}
                        </View>

                        {/* Activity Timeline (Structured) */}
                        <View style={{ marginBottom: spacing.xl }}>
                            <SectionHeader title="Activity" icon={History} />
                            <View style={styles.activityTimeline}>
                                {ticket.activities && ticket.activities.length > 0 ? (
                                    ticket.activities.map((act: any, idx: number) => (
                                        <View key={act.id} style={styles.activityItemWrapper}>
                                            <View style={styles.timelineLeft}>
                                                <View style={[styles.timelineDot, { backgroundColor: colors.border }]} />
                                                {idx !== ticket.activities.length - 1 && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
                                            </View>
                                            <Card style={styles.activityContentCard}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                    <Text style={styles.activityType}>{act.type.replace(/_/g, ' ')}</Text>
                                                    <Text style={styles.activityTime}>{format(new Date(act.timestamp), 'MMM dd, h:mm a')}</Text>
                                                </View>
                                                {act.from && act.to && (
                                                    <Text style={styles.activityDetail}>{act.from} → {act.to}</Text>
                                                )}
                                                <Text style={styles.activityUser}>{act.user}</Text>
                                            </Card>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.emptyContainer}><Text style={styles.emptyText}>No activity found.</Text></View>
                                )}
                            </View>
                        </View>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Status Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={statusModalVisible}
                onRequestClose={() => setStatusModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Update Status</Text>
                            <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                                <X size={24} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        {getStatusOptions().map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[
                                    styles.statusOption,
                                    { backgroundColor: ticket.status === opt.value ? colors.secondary : 'transparent' }
                                ]}
                                onPress={() => handleStatusChange(opt.value)}
                            >
                                <StatusBadge status={opt.value as any} />
                                {ticket.status === opt.value && <CheckCircle size={16} color={colors.primary} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerCard: {
        margin: spacing.md,
        gap: spacing.sm,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    ticketTitle: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        maxWidth: 240,
    },
    projectName: {
        fontSize: fontSize.sm,
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    approvalBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        borderRadius: 8,
        marginTop: 8
    },
    section: {
        paddingHorizontal: spacing.md,
    },
    collapsibleCard: {
        marginTop: spacing.md,
        padding: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: fontSize.base,
        fontWeight: 'bold',
    },
    sectionHeaderPlain: {
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
        paddingBottom: 8,
    },
    plainSectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    infoLabel: {
        width: 80,
        fontSize: fontSize.sm,
        marginLeft: 8,
    },
    infoValue: {
        flex: 1,
        fontSize: fontSize.sm,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#f1f1f1',
        marginVertical: 12,
    },
    // New History Styles
    attachmentCard: {
        padding: spacing.sm,
        marginBottom: spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f1f1',
    },
    fileIcon: {
        width: 44,
        height: 44,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileTypeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6b7280',
    },
    fileName: {
        fontWeight: '600',
        fontSize: 14,
    },
    dependencyCard: {
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f1f1f1',
    },
    dependencyName: {
        fontWeight: '600',
        fontSize: 14,
    },
    dependencyRemarks: {
        fontSize: 12,
        marginTop: 2,
    },
    inventoryCard: {
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f1f1f1',
    },
    inventoryName: {
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
    inventoryQty: {
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    },
    activityLogCard: {
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f1f1f1',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#9ca3af',
        fontStyle: 'italic',
        fontSize: 14,
    },
    // Activity Timeline Styles
    activityTimeline: {
        paddingLeft: 4,
    },
    activityItemWrapper: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    timelineLeft: {
        width: 20,
        alignItems: 'center',
    },
    timelineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 16,
        zIndex: 1,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        marginTop: 0,
    },
    activityContentCard: {
        flex: 1,
        padding: 14,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderRadius: 12,
        shadowOpacity: 0,
        elevation: 0,
    },
    activityType: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    activityTime: {
        fontSize: 10,
        color: '#94a3b8',
    },
    activityDetail: {
        fontSize: 13,
        color: '#0f172a',
        marginTop: 4,
        fontWeight: '600',
    },
    activityUser: {
        fontSize: 11,
        color: '#64748b',
        marginTop: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: spacing.xl,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    modalTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
    },
    statusOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
    }
});
