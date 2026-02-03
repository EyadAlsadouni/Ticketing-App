// app/(app)/(tabs)/tickets.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, RefreshControl, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../shared/context/ThemeContext';
import { useTicketsStore } from '../../../features/tickets/store';
import { TicketCard } from '../../../features/tickets/components/TicketCard';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Button } from '../../../components/ui/Button';
import { Plus, Filter, X } from 'lucide-react-native';
import { spacing, fontSize, borderRadius } from '../../../shared/theme';

export default function TicketsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const {
        filteredTickets,
        isLoading,
        searchQuery,
        activeStatusFilter,
        activeApprovalFilter,
        fetchTickets,
        searchTickets,
        filterByStatus,
        filterByApproval,
        bulkUpdateTickets
    } = useTicketsStore();

    const [selectedTicketIds, setSelectedTicketIds] = useState<Set<number>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);
    const [bulkUpdateModalVisible, setBulkUpdateModalVisible] = useState(false);

    // Bulk Update State
    const [bulkStatus, setBulkStatus] = useState<string | null>(null);
    const [bulkPriority, setBulkPriority] = useState<string | null>(null);

    const handleLongPress = (id: number) => {
        setSelectionMode(true);
        const newSet = new Set(selectedTicketIds);
        newSet.add(id);
        setSelectedTicketIds(newSet);
    };

    const handleSelectTicket = (id: number) => {
        const newSet = new Set(selectedTicketIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedTicketIds(newSet);
        if (newSet.size === 0) {
            setSelectionMode(false);
        }
    };

    const handleCancelSelection = () => {
        setSelectedTicketIds(new Set());
        setSelectionMode(false);
    };

    const handleBulkUpdate = async () => {
        const updates: any = {};
        if (bulkStatus) updates.status = bulkStatus;
        if (bulkPriority) updates.priority = bulkPriority;

        if (Object.keys(updates).length > 0) {
            await bulkUpdateTickets(Array.from(selectedTicketIds), updates);
        }

        setBulkUpdateModalVisible(false);
        handleCancelSelection();
        setBulkStatus(null);
        setBulkPriority(null);
    };

    const [refreshing, setRefreshing] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchTickets();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <TicketCard
            ticket={item}
            selectionMode={selectionMode}
            selected={selectedTicketIds.has(item.id)}
            onSelect={() => handleSelectTicket(item.id)}
            onLongPress={() => handleLongPress(item.id)}
        />
    );

    const statusOptions = ['All Statuses', 'Open', 'In Progress', 'Suspended', 'Closed'];
    const approvalOptions = ['All Approval Statuses', 'Pending', 'Approved', 'Rejected'];

    const handleApplyFilter = (type: 'status' | 'approval', value: string) => {
        if (type === 'status') filterByStatus(value);
        if (type === 'approval') filterByApproval(value);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                {selectionMode ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, paddingHorizontal: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <TouchableOpacity onPress={handleCancelSelection}>
                                <X size={24} color={colors.foreground} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: fontSize.lg, fontWeight: 'bold', color: colors.foreground }}>
                                {selectedTicketIds.size} Selected
                            </Text>
                        </View>
                        {selectedTicketIds.size > 0 && (
                            <TouchableOpacity
                                onPress={() => setBulkUpdateModalVisible(true)}
                                style={{ backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.md }}
                            >
                                <Text style={{ color: '#fff', fontWeight: '600' }}>Update</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <SearchBar
                        value={searchQuery}
                        onChangeText={searchTickets}
                        placeholder="Search tickets (ID, Title)..."
                        style={{ flex: 1 }}
                    />
                )}
                {!selectionMode && (
                    <TouchableOpacity
                        style={[styles.filterBtn, { backgroundColor: (activeStatusFilter || activeApprovalFilter) ? colors.primary : colors.card }]}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <Filter size={20} color={(activeStatusFilter || activeApprovalFilter) ? '#fff' : colors.foreground} />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={filteredTickets}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                            {isLoading ? 'Loading tickets...' : 'No tickets found'}
                        </Text>
                    </View>
                }
            />



            {/* Bulk Update Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={bulkUpdateModalVisible}
                onRequestClose={() => setBulkUpdateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Update Selected Tickets</Text>
                            <TouchableOpacity onPress={() => setBulkUpdateModalVisible(false)}>
                                <X size={24} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ marginBottom: 8, fontWeight: '600', color: colors.foreground }}>New Status</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                            {['open', 'inProgress', 'suspended', 'pending'].map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => setBulkStatus(status)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: bulkStatus === status ? colors.primary : colors.border,
                                        backgroundColor: bulkStatus === status ? `${colors.primary}20` : 'transparent',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8
                                    }}
                                >
                                    <Text style={{ color: bulkStatus === status ? colors.primary : colors.mutedForeground, textTransform: 'capitalize' }}>
                                        {status.replace(/([A-Z])/g, ' $1').trim()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={{ marginBottom: 8, fontWeight: '600', color: colors.foreground }}>New Priority</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                            {['critical', 'high', 'medium', 'low'].map((prio) => (
                                <TouchableOpacity
                                    key={prio}
                                    onPress={() => setBulkPriority(prio)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: bulkPriority === prio ? colors.primary : colors.border,
                                        backgroundColor: bulkPriority === prio ? `${colors.primary}20` : 'transparent',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8
                                    }}
                                >
                                    <Text style={{ color: bulkPriority === prio ? colors.primary : colors.mutedForeground, textTransform: 'capitalize' }}>
                                        {prio}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Button
                            variant="default"
                            onPress={handleBulkUpdate}
                        >
                            {`Update ${selectedTicketIds.size} Tickets`}
                        </Button>
                    </View>
                </View>
            </Modal>

            {/* Filter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Filter Tickets</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <X size={24} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>Status</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
                            {statusOptions.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: (activeStatusFilter === opt || (!activeStatusFilter && opt === 'All Statuses'))
                                                ? colors.primary
                                                : colors.secondary
                                        }
                                    ]}
                                    onPress={() => handleApplyFilter('status', opt)}
                                >
                                    <Text style={{
                                        color: (activeStatusFilter === opt || (!activeStatusFilter && opt === 'All Statuses'))
                                            ? '#fff'
                                            : colors.foreground
                                    }}>
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={[styles.filterLabel, { color: colors.mutedForeground, marginTop: 20 }]}>Approval</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
                            {approvalOptions.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: (activeApprovalFilter === opt || (!activeApprovalFilter && opt === 'All Approval Statuses'))
                                                ? colors.primary
                                                : colors.secondary
                                        }
                                    ]}
                                    onPress={() => handleApplyFilter('approval', opt)}
                                >
                                    <Text style={{
                                        color: (activeApprovalFilter === opt || (!activeApprovalFilter && opt === 'All Approval Statuses'))
                                            ? '#fff'
                                            : colors.foreground
                                    }}>
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Button style={{ marginTop: 30 }} onPress={() => setFilterModalVisible(false)}>
                            Done
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: spacing.md,
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'center'
    },
    filterBtn: {
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContent: {
        padding: spacing.md,
        paddingTop: 0,
        paddingBottom: 80, // Space for FAB
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: fontSize.base,
    },
    fab: {
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        marginBottom: spacing.lg,
    },
    modalTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
    },
    filterLabel: {
        fontWeight: '600',
        marginBottom: 8
    },
    chipsRow: {
        flexDirection: 'row',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    }
});
