// app/(app)/inventory_return.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    TextInput,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTheme } from '../../shared/context/ThemeContext';
import {
    ChevronLeft,
    Search,
    ChevronDown,
    ChevronUp,
    Package
} from 'lucide-react-native';
import { spacing, fontSize, borderRadius } from '../../shared/theme';
import { Badge } from '../../components/ui/Badge';
import { useInventoryStore } from '../../features/inventory/store';
import { InventoryReturn } from '../../features/inventory/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function InventoryReturnScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { returns, fetchReturns, isLoading } = useInventoryStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    useEffect(() => {
        fetchReturns();
    }, []);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filteredReturns = returns.filter(item =>
        item.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requestedTo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Return': return 'info';
            case 'Pending': return 'warning';
            case 'Completed': return 'success';
            default: return 'outline';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Inventory Returns',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <ChevronLeft size={24} color={colors.foreground} />
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
                        placeholder="Search return number..."
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
                <ScrollView horizontal>
                    <View style={styles.tableContainer}>
                        {/* Header */}
                        <View style={[styles.tableHeader, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB', borderBottomColor: colors.border }]}>
                            <View style={{ width: 40 }} />
                            <Text style={[styles.headerCell, { width: 180, color: colors.mutedForeground }]}>Return #</Text>
                            <Text style={[styles.headerCell, { width: 120, color: colors.mutedForeground }]}>Requested By</Text>
                            <Text style={[styles.headerCell, { width: 90, color: colors.mutedForeground }]}>Requested To</Text>
                            <Text style={[styles.headerCell, { width: 160, color: colors.mutedForeground, textAlign: 'center' }]}>Status</Text>
                            <Text style={[styles.headerCell, { width: 140, color: colors.mutedForeground }]}>Created</Text>
                            <Text style={[styles.headerCell, { width: 60, color: colors.mutedForeground, textAlign: 'center' }]}>Items</Text>
                            <Text style={[styles.headerCell, { width: 80, color: colors.mutedForeground, textAlign: 'center' }]}>Remarks</Text>
                            <Text style={[styles.headerCell, { width: 80, color: colors.mutedForeground, textAlign: 'center' }]}>Actions</Text>
                        </View>

                        {/* Rows */}
                        <ScrollView contentContainerStyle={styles.tableBody}>
                            {filteredReturns.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Package size={48} color={colors.mutedForeground} />
                                    <Text style={{ color: colors.mutedForeground, marginTop: 12 }}>No returns found</Text>
                                </View>
                            ) : (
                                filteredReturns.map((item) => {
                                    const isExpanded = expandedIds.includes(item.id);
                                    return (
                                        <View key={item.id} style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => toggleExpand(item.id)}
                                                style={styles.tableRow}
                                            >
                                                <View style={{ width: 40, alignItems: 'center' }}>
                                                    {isExpanded ? <ChevronDown size={18} color={colors.mutedForeground} /> : <ChevronRight size={18} color={colors.mutedForeground} />}
                                                </View>
                                                <Text style={[styles.cell, { width: 180, color: colors.foreground, fontSize: 11 }]}>{item.returnNumber}</Text>
                                                <Text style={[styles.cell, { width: 120, color: colors.foreground }]}>{item.requestedBy}</Text>
                                                <View style={[styles.cell, { width: 150 }]}>
                                                    <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 11 }}>{item.requestedTo.split('\n')[0]}</Text>
                                                    <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>{item.requestedTo.split('\n')[1]}</Text>
                                                </View>
                                                <View style={{ width: 100, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Badge variant={getStatusVariant(item.status)} size="xs">{item.status}</Badge>
                                                </View>
                                                <Text style={[styles.cell, { width: 140, color: colors.foreground, fontSize: 11 }]}>{item.created}</Text>
                                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={[styles.countBadge, { backgroundColor: colors.muted }]}>
                                                        <Text style={{ color: colors.foreground, fontSize: 10, fontWeight: 'bold' }}>{item.itemCount}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{ width: 80, color: colors.mutedForeground, textAlign: 'center', fontSize: 12 }}>{item.remarks}</Text>
                                                <Text style={{ width: 80, textAlign: 'center', color: colors.mutedForeground, fontSize: 12 }}>-</Text>
                                            </TouchableOpacity>

                                            {isExpanded && (
                                                <View style={[styles.expandedContent, { backgroundColor: isDark ? '#111827' : '#F3F4F6' }]}>
                                                    <View style={styles.expandedHeader}>
                                                        <Text style={[styles.expandedHeaderText, { width: '40%' }]}>Item (Code/Name)</Text>
                                                        <Text style={[styles.expandedHeaderText, { width: '20%', textAlign: 'center' }]}>Qty</Text>
                                                        <Text style={[styles.expandedHeaderText, { width: '20%', textAlign: 'center' }]}>Issued</Text>
                                                        <Text style={[styles.expandedHeaderText, { width: '20%' }]}>Remarks</Text>
                                                    </View>
                                                    {item.items.map((subItem) => (
                                                        <View key={subItem.id} style={styles.expandedRow}>
                                                            <View style={{ width: '40%' }}>
                                                                <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 11 }}>{subItem.itemCode}</Text>
                                                                <Text style={{ color: colors.mutedForeground, fontSize: 10 }} numberOfLines={1}>{subItem.itemName}</Text>
                                                            </View>
                                                            <Text style={{ width: '20%', textAlign: 'center', color: colors.foreground, fontSize: 11 }}>{subItem.quantity}</Text>
                                                            <Text style={{ width: '20%', textAlign: 'center', color: colors.foreground, fontSize: 11 }}>{subItem.issued}</Text>
                                                            <Text style={{ width: '20%', color: colors.mutedForeground, fontSize: 10 }}>{subItem.remarks || '-'}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    );
                                })
                            )}
                        </ScrollView>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

// ChevronRight for the compressed view
const ChevronRight = ({ size, color }: { size: number, color: string }) => (
    <View style={{ transform: [{ rotate: '0deg' }] }}>
        <ChevronLeft size={size} color={color} style={{ transform: [{ rotate: '180deg' }] }} />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchContainer: { padding: spacing.md, paddingBottom: 0 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        height: 44, // Match searchBar height for centering
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    tableContainer: { padding: spacing.md },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderTopLeftRadius: borderRadius.md,
        borderTopRightRadius: borderRadius.md,
    },
    headerCell: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableBody: { paddingBottom: 100 },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    cell: { paddingRight: 10, fontSize: 12 },
    countBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        width: 800, // Matching table width
    },
    expandedContent: {
        padding: spacing.md,
    },
    expandedHeader: {
        flexDirection: 'row',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        marginBottom: 8,
    },
    expandedHeaderText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    expandedRow: {
        flexDirection: 'row',
        paddingVertical: 4,
        alignItems: 'center',
    }
});
