// app/(app)/inventory_new_request.tsx
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Modal,
    FlatList,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTheme } from '../../shared/context/ThemeContext';
import { ChevronLeft, Plus, Search, Trash2, X, Check, ChevronDown } from 'lucide-react-native';
import { spacing, fontSize, borderRadius } from '../../shared/theme';
import { Card } from '../../components/ui/Card';
import { useInventoryStore } from '../../features/inventory/store';
import { InventoryCatalogItem, RequestedItem } from '../../features/inventory/types';
import { MOCK_DROPDOWN_DATA } from '../../mock/data';

interface DropdownProps {
    label: string;
    value: string;
    onSelect: (value: string) => void;
    options: string[];
    placeholder: string;
    required?: boolean;
}

const DropdownField = ({ label, value, onSelect, options, placeholder, required }: DropdownProps) => {
    const { colors } = useTheme();
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.formCol}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
                {label} {required && '*'}
            </Text>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setVisible(true)}
                style={[styles.input, { borderColor: colors.border, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}
            >
                <Text style={{ color: value ? colors.foreground : colors.mutedForeground, fontSize: 13 }}>
                    {value || placeholder}
                </Text>
                <ChevronDown size={16} color={colors.mutedForeground} />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Select {label}</Text>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <X size={20} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.optionItem, { borderBottomColor: colors.border }]}
                                    onPress={() => {
                                        onSelect(item);
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={{ color: colors.foreground }}>{item}</Text>
                                    {value === item && <Check size={16} color={colors.primary} />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default function InventoryNewRequestScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { catalog, addRequest } = useInventoryStore();

    // Form State
    const [role, setRole] = useState('');
    const [user, setUser] = useState('');
    const [region, setRegion] = useState('');
    const [location, setLocation] = useState('');
    const [ticket, setTicket] = useState('');
    const [remarks, setRemarks] = useState('');

    // Items Section State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<RequestedItem[]>([]);

    const filteredCatalog = useMemo(() => {
        if (!searchQuery) return catalog;
        return catalog.filter(
            (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [catalog, searchQuery]);

    const addItem = (item: InventoryCatalogItem) => {
        if (selectedItems.find((i) => i.itemCode === item.code)) {
            Alert.alert('Item already added', 'This item is already in your selection.');
            return;
        }

        const newItem: RequestedItem = {
            id: Math.random().toString(36).substr(2, 9),
            itemCode: item.code,
            itemName: item.name,
            quantity: 1,
            issued: 0,
            status: 'Pending',
            remarks: '',
        };

        setSelectedItems((prev) => [...prev, newItem]);
    };

    const removeItem = (id: string) => {
        setSelectedItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateItemQty = (id: string, qty: string) => {
        const numQty = parseInt(qty) || 0;
        setSelectedItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: numQty } : i))
        );
    };

    const updateItemRemarks = (id: string, remark: string) => {
        setSelectedItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, remarks: remark } : i))
        );
    };

    const handleSubmit = async () => {
        if (!role || !user || selectedItems.length === 0) {
            Alert.alert('Incomplete Form', 'Please fill in required fields and add at least one item.');
            return;
        }

        try {
            await addRequest({
                requestedTo: user,
                requestedBy: 'fieldengineer', // Hardcoded for now
                items: selectedItems,
                remarks,
            });
            Alert.alert('Success', 'Inventory request submitted successfully.');
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to submit request.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Create Inventory Request',
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

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 1. Request Details Section */}
                <Card style={styles.sectionCard}>
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Request Details</Text>
                    <View style={styles.formRow}>
                        <DropdownField
                            label="Role"
                            required
                            placeholder="Select role..."
                            value={role}
                            onSelect={setRole}
                            options={MOCK_DROPDOWN_DATA.roles}
                        />
                        <DropdownField
                            label="User"
                            required
                            placeholder="Select user..."
                            value={user}
                            onSelect={setUser}
                            options={MOCK_DROPDOWN_DATA.users}
                        />
                    </View>

                    <View style={styles.formRow}>
                        <DropdownField
                            label="Region"
                            placeholder="Select region..."
                            value={region}
                            onSelect={setRegion}
                            options={MOCK_DROPDOWN_DATA.regions}
                        />
                        <DropdownField
                            label="Location"
                            placeholder="Select location..."
                            value={location}
                            onSelect={setLocation}
                            options={MOCK_DROPDOWN_DATA.locations}
                        />
                    </View>

                    <View style={styles.formRow}>
                        <DropdownField
                            label="Ticket"
                            placeholder="Select ticket..."
                            value={ticket}
                            onSelect={setTicket}
                            options={MOCK_DROPDOWN_DATA.tickets}
                        />
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.formCol}>
                            <Text style={[styles.label, { color: colors.mutedForeground }]}>Remarks</Text>
                            <TextInput
                                style={[styles.textAreaInput, { color: colors.foreground, borderColor: colors.border }]}
                                value={remarks}
                                onChangeText={setRemarks}
                                placeholder="Enter remarks"
                                placeholderTextColor={colors.mutedForeground}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>
                </Card>

                {/* 2. Find Items Section */}
                <Card style={styles.sectionCard}>
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Find Items</Text>
                    <View style={[styles.searchBar, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB', borderColor: colors.border }]}>
                        <Search size={18} color={colors.mutedForeground} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.foreground }]}
                            placeholder="Search by Code, Name, Model..."
                            placeholderTextColor={colors.mutedForeground}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <View style={styles.catalogList}>
                        {filteredCatalog.map((item) => (
                            <View key={item.id} style={[styles.catalogItem, { borderBottomColor: colors.border }]}>
                                <View style={styles.catInfo}>
                                    <Text style={[styles.catCode, { color: colors.primary }]}>{item.code}</Text>
                                    <Text style={[styles.catName, { color: colors.foreground }]} numberOfLines={2}>{item.name}</Text>
                                    <View style={styles.catMeta}>
                                        <Text style={[styles.catMetaText, { color: colors.mutedForeground }]}>V: {item.vendor}</Text>
                                        <Text style={[styles.catMetaText, { color: colors.mutedForeground }]}>Avail: {item.available}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => addItem(item)}
                                    style={[styles.addBtn, { borderColor: colors.primary }]}
                                >
                                    <Plus size={16} color={colors.primary} />
                                    <Text style={[styles.addBtnText, { color: colors.primary }]}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* 3. Selected Items Section */}
                {selectedItems.length > 0 && (
                    <Card style={styles.sectionCard}>
                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Selected Items ({selectedItems.length})</Text>
                        {selectedItems.map((item) => (
                            <View key={item.id} style={[styles.selectedItem, { borderBottomColor: colors.border }]}>
                                <View style={styles.selHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.selName, { color: colors.foreground }]} numberOfLines={2}>{item.itemName}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.trashBtn}>
                                        <Trash2 size={18} color={colors.destructive} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.selForm}>
                                    <View style={styles.selCol}>
                                        <Text style={[styles.selLabel, { color: colors.mutedForeground }]}>Qty</Text>
                                        <TextInput
                                            style={[styles.selInput, { color: colors.foreground, borderColor: colors.border, paddingVertical: 0 }]}
                                            keyboardType="numeric"
                                            value={item.quantity.toString()}
                                            onChangeText={(v) => updateItemQty(item.id, v)}
                                        />
                                    </View>
                                    <View style={[styles.selCol, { flex: 2 }]}>
                                        <Text style={[styles.selLabel, { color: colors.mutedForeground }]}>Remarks</Text>
                                        <TextInput
                                            style={[styles.selInput, { color: colors.foreground, borderColor: colors.border, paddingVertical: 0 }]}
                                            placeholder="Item remarks..."
                                            placeholderTextColor={colors.mutedForeground}
                                            value={item.remarks}
                                            onChangeText={(v) => updateItemRemarks(item.id, v)}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </Card>
                )}

                {/* Move Footer into ScrollView to avoid navigation bar overlap */}
                <View style={[styles.inlineFooter, { marginTop: spacing.lg }]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.footerBtn, styles.cancelBtn, { borderColor: colors.border }]}
                    >
                        <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={[styles.footerBtn, styles.submitBtn, { backgroundColor: colors.primary }]}
                    >
                        <Check size={18} color="#FFF" />
                        <Text style={styles.submitBtnText}>Submit Request</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        gap: spacing.md,
        paddingBottom: 40,
    },
    sectionCard: {
        padding: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.base,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    formRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    formCol: {
        flex: 1,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: borderRadius.md,
        paddingHorizontal: 12,
        paddingVertical: 0,
    },
    textAreaInput: {
        height: 80,
        borderWidth: 1,
        borderRadius: borderRadius.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        textAlignVertical: 'top',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 40,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        marginBottom: spacing.md,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14, // Adjusted to match others
        height: 40, // Match searchBar height
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    catalogList: {
        gap: 0,
    },
    catalogItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    catInfo: {
        flex: 1,
        paddingRight: 8,
    },
    catCode: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    catName: {
        fontSize: 12,
        marginBottom: 4,
        lineHeight: 16,
    },
    catMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    catMetaText: {
        fontSize: 10,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    addBtnText: {
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    selectedItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    selHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    selName: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 16,
    },
    trashBtn: {
        padding: 4,
        marginLeft: 8,
    },
    selForm: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    selCol: {
        flex: 1,
    },
    selLabel: {
        fontSize: 10,
        marginBottom: 4,
    },
    selInput: {
        height: 36,
        borderWidth: 1,
        borderRadius: borderRadius.sm,
        paddingHorizontal: 8,
        fontSize: 12,
    },
    inlineFooter: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingBottom: spacing.xl,
    },
    footerBtn: {
        flex: 1,
        height: 48,
        borderRadius: borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    cancelBtn: {
        borderWidth: 1,
    },
    submitBtn: {
        flex: 2,
    },
    cancelBtnText: {
        fontWeight: '600',
    },
    submitBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxHeight: '70%',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: fontSize.base,
        fontWeight: 'bold',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
    },
});
