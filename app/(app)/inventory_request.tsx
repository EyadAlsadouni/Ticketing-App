// app/(app)/inventory_request.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTheme } from '../../shared/context/ThemeContext';
import {
    ChevronLeft,
    Plus,
    Search,
    ChevronDown,
    ChevronUp,
    Trash2,
    Calendar,
    User,
    Package,
} from 'lucide-react-native';
import { spacing, fontSize, borderRadius } from '../../shared/theme';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useInventoryStore } from '../../features/inventory/store';
import { InventoryRequest, RequestedItem } from '../../features/inventory/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function InventoryRequestScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { requests, fetchRequests, isLoading, deleteRequest } = useInventoryStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filteredRequests = requests.filter(
        (req) =>
            req.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.requestedTo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatName = (name: string) => {
        if (!name) return '';
        if (name === 'operationsmanager') return 'Operation Manager';
        if (name === 'fieldengineer') return 'Field Engineer';
        if (name === 'logisticssupervisor') return 'Logistics Supervisor';
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Accept':
                return 'secondary';
            case 'Released':
                return 'secondary';
            case 'Out of Stock':
                return 'destructive';
            case 'Pending':
                return 'warning';
            default:
                return 'outline';
        }
    };

    const renderRequestItem = ({ item }: { item: InventoryRequest }) => {
        const isExpanded = expandedIds.includes(item.id);

        return (
            <Card style={styles.requestCard}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleExpand(item.id)}
                    style={styles.cardHeader}
                >
                    <View style={styles.headerTop}>
                        <View style={styles.reqNumContainer}>
                            <Text style={[styles.requestNumber, { color: colors.primary }]}>
                                {item.requestNumber}
                            </Text>
                            <Badge variant={getStatusVariant(item.status)} size="sm">
                                {item.status}
                            </Badge>
                        </View>
                        <TouchableOpacity
                            onPress={() => deleteRequest(item.id)}
                            style={styles.deleteBtn}
                        >
                            <Trash2 size={18} color={colors.destructive} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerInfo}>
                        <View style={styles.infoRow}>
                            <User size={14} color={colors.mutedForeground} />
                            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                                To: {formatName(item.requestedTo)}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Calendar size={14} color={colors.mutedForeground} />
                            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                                {item.requestedOn}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.expandRow}>
                        <Text style={[styles.itemCount, { color: colors.foreground }]}>
                            {item.items.length} item(s)
                        </Text>
                        {isExpanded ? (
                            <ChevronUp size={20} color={colors.mutedForeground} />
                        ) : (
                            <ChevronDown size={20} color={colors.mutedForeground} />
                        )}
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <CardContent style={styles.expandedContent}>
                        <View style={[styles.itemsTable, { borderTopColor: colors.border }]}>
                            <View style={[styles.tableHeader, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
                                <Text style={[styles.tableHeaderCell, { flex: 0.5, color: colors.mutedForeground }]}>#</Text>
                                <Text style={[styles.tableHeaderCell, { flex: 2, color: colors.mutedForeground }]}>Item</Text>
                                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center', color: colors.mutedForeground }]}>Qty</Text>
                                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center', color: colors.mutedForeground }]}>Issued</Text>
                            </View>
                            {item.items.map((it, idx) => (
                                <View key={it.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                                    <Text style={[styles.tableCell, { flex: 0.5, color: colors.foreground }]}>{idx + 1}</Text>
                                    <View style={{ flex: 2 }}>
                                        <Text style={[styles.itemCode, { color: colors.foreground }]}>{it.itemCode}</Text>
                                        <Text style={[styles.itemName, { color: colors.mutedForeground }]} numberOfLines={1}>{it.itemName}</Text>
                                        <Badge variant={getStatusVariant(it.status)} size="xs" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                                            {it.status}
                                        </Badge>
                                    </View>
                                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', color: colors.foreground }]}>{it.quantity}</Text>
                                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', color: colors.foreground }]}>{it.issued}</Text>
                                </View>
                            ))}
                        </View>
                        {item.remarks && (
                            <View style={styles.remarksContainer}>
                                <Text style={[styles.remarksLabel, { color: colors.mutedForeground }]}>Remarks:</Text>
                                <Text style={[styles.remarksText, { color: colors.foreground }]}>{item.remarks}</Text>
                            </View>
                        )}
                    </CardContent>
                )}
            </Card>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Inventory Requests',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <ChevronLeft size={24} color={colors.foreground} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => router.push('/inventory_new_request')}
                            style={[styles.newBtn, { backgroundColor: colors.primary }]}
                        >
                            <Plus size={18} color="#FFF" />
                            <Text style={styles.newBtnText}>New</Text>
                        </TouchableOpacity>
                    ),
                    headerTitleAlign: 'left',
                    headerTitleStyle: { color: colors.foreground, fontWeight: 'bold' },
                    headerStyle: { backgroundColor: colors.card },
                }}
            />

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Search size={20} color={colors.mutedForeground} />
                    <TextInput
                        placeholder="Search request number..."
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.searchInput, { color: colors.foreground }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredRequests}
                    renderItem={renderRequestItem}
                    keyExtractor={(it) => it.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Package size={48} color={colors.mutedForeground} />
                            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                                No requests found
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borderRadius.md,
        marginRight: 4,
    },
    newBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: fontSize.sm,
    },
    searchContainer: {
        padding: spacing.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: fontSize.sm,
        height: 44, // Match searchBar height for centering
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    listContent: {
        padding: spacing.md,
        gap: spacing.md,
    },
    requestCard: {
        marginBottom: spacing.xs,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: spacing.md,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    reqNumContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    requestNumber: {
        fontWeight: '700',
        fontSize: fontSize.sm,
    },
    deleteBtn: {
        padding: 4,
    },
    headerInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: fontSize.xs,
    },
    expandRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: 'transparent', // Space hack
        paddingTop: 8,
    },
    itemCount: {
        fontSize: fontSize.xs,
        fontWeight: '600',
    },
    expandedContent: {
        padding: 0,
        paddingBottom: spacing.md,
    },
    itemsTable: {
        borderTopWidth: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        padding: 10,
    },
    tableHeaderCell: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
    },
    tableCell: {
        fontSize: 11,
    },
    itemCode: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    itemName: {
        fontSize: 10,
        marginTop: 2,
    },
    remarksContainer: {
        padding: spacing.md,
        marginTop: 8,
    },
    remarksLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    remarksText: {
        fontSize: 11,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: fontSize.sm,
    },
});
