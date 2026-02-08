// app/(app)/inventory_received.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTheme } from '../../shared/context/ThemeContext';
import {
    ChevronLeft,
    Search,
    Check,
    X,
    ChevronDown,
    ArrowRightCircle,
    RotateCcw
} from 'lucide-react-native';
import { spacing, fontSize, borderRadius } from '../../shared/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useInventoryStore } from '../../features/inventory/store';
import { InventoryReleaseItem } from '../../features/inventory/types';
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
                        <ScrollView>
                            {options.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.optionItem, { borderBottomColor: colors.border }]}
                                    onPress={() => {
                                        onSelect(item);
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={{ color: colors.foreground }}>{item}</Text>
                                    {value === item && <Check size={16} color={colors.primary} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default function InventoryReceivedScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { receivedItems, fetchReceived, isLoading, acceptItem, applyItem, returnItem } = useInventoryStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [applyModalVisible, setApplyModalVisible] = useState(false);
    const [returnModalVisible, setReturnModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryReleaseItem | null>(null);

    // Apply Form State
    const [applyTicket, setApplyTicket] = useState('');
    const [applyLocation, setApplyLocation] = useState('');
    const [applyQty, setApplyQty] = useState('1');
    const [applyRemarks, setApplyRemarks] = useState('');

    // Return Form State
    const [returnRole, setReturnRole] = useState('');
    const [returnUser, setReturnUser] = useState('');
    const [returnProject, setReturnProject] = useState('');
    const [returnLocation, setReturnLocation] = useState('');
    const [returnTicket, setReturnTicket] = useState('');
    const [returnRemarks, setReturnRemarks] = useState('');

    useEffect(() => {
        fetchReceived();
    }, []);

    const filteredItems = receivedItems.filter(item =>
        item.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAccept = (id: string) => {
        Alert.alert('Accept Item', 'Are you sure you want to accept this item?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Accept', onPress: () => acceptItem(id) }
        ]);
    };

    const openApplyModal = (item: InventoryReleaseItem) => {
        setSelectedItem(item);
        setApplyQty(item.issued.toString());
        setApplyModalVisible(true);
    };

    const openReturnModal = (item: InventoryReleaseItem) => {
        setSelectedItem(item);
        setReturnModalVisible(true);
    };

    const submitApply = async () => {
        if (!applyLocation) {
            Alert.alert('Required Field', 'Please select a location.');
            return;
        }
        if (selectedItem) {
            await applyItem(selectedItem.id, { ticket: applyTicket, location: applyLocation, qty: applyQty, remarks: applyRemarks });
            setApplyModalVisible(false);
            Alert.alert('Success', 'Inventory applied successfully.');
        }
    };

    const submitReturn = async () => {
        if (!returnRole || !returnUser) {
            Alert.alert('Required Fields', 'Please select role and user.');
            return;
        }
        if (selectedItem) {
            await returnItem(selectedItem.id, { role: returnRole, user: returnUser, project: returnProject, location: returnLocation, ticket: returnTicket, remarks: returnRemarks });
            setReturnModalVisible(false);
            Alert.alert('Success', 'Return request submitted.');
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Released': return 'success';
            case 'Accept': return 'info';
            case 'Pending': return 'warning';
            case 'Returned': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Inventory Received',
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
                        placeholder="Search barcode or request..."
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
                            <Text style={[styles.headerCell, { width: 180, color: colors.mutedForeground }]}>Request #</Text>
                            <Text style={[styles.headerCell, { width: 200, color: colors.mutedForeground }]}>Item (Code/Name)</Text>
                            <Text style={[styles.headerCell, { width: 80, color: colors.mutedForeground }]}>Model</Text>
                            <Text style={[styles.headerCell, { width: 100, color: colors.mutedForeground }]}>Vendor</Text>
                            <Text style={[styles.headerCell, { width: 140, color: colors.mutedForeground }]}>Barcode</Text>
                            <Text style={[styles.headerCell, { width: 60, color: colors.mutedForeground, textAlign: 'center' }]}>Issued</Text>
                            <Text style={[styles.headerCell, { width: 120, color: colors.mutedForeground, textAlign: 'center' }]}>Status</Text>
                            <Text style={[styles.headerCell, { width: 150, color: colors.mutedForeground, textAlign: 'center' }]}>Actions</Text>
                        </View>

                        {/* Rows */}
                        <ScrollView contentContainerStyle={styles.tableBody}>
                            {filteredItems.map((item) => (
                                <View key={item.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                                    <View style={[styles.cell, { width: 180 }]}>
                                        <Text style={[styles.cellText, { color: colors.foreground, fontSize: 11 }]}>{item.requestNumber}</Text>
                                    </View>
                                    <View style={[styles.cell, { width: 200 }]}>
                                        <Text style={[styles.cellText, { color: colors.primary, fontWeight: 'bold' }]}>{item.itemCode}</Text>
                                        <Text style={[styles.cellText, { color: colors.mutedForeground, fontSize: 10 }]} numberOfLines={2}>{item.itemName}</Text>
                                    </View>
                                    <Text style={[styles.cell, styles.cellText, { width: 80, color: colors.foreground }]}>{item.model}</Text>
                                    <Text style={[styles.cell, styles.cellText, { width: 100, color: colors.foreground }]}>{item.vendor}</Text>
                                    <Text style={[styles.cell, styles.cellText, { width: 140, color: colors.foreground, fontSize: 11 }]}>{item.barcode}</Text>
                                    <Text style={[styles.cellText, { width: 100, color: colors.foreground, textAlign: 'center' }]}>{item.issued}</Text>
                                    <View style={{ width: 120, alignItems: 'center', justifyContent: 'center' }}>
                                        <Badge variant={getStatusVariant(item.status)} size="xs">{item.status}</Badge>
                                    </View>
                                    <View style={{ width: 80, flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
                                        {item.status === 'Released' && (
                                            <TouchableOpacity
                                                onPress={() => handleAccept(item.id)}
                                                style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
                                            >
                                                <Text style={styles.actionBtnText}>Accept</Text>
                                            </TouchableOpacity>
                                        )}
                                        {item.status === 'Accept' && (
                                            <>
                                                <TouchableOpacity
                                                    onPress={() => openApplyModal(item)}
                                                    style={[styles.actionBtn, { backgroundColor: '#4267B2' }]}
                                                >
                                                    <Text style={styles.actionBtnText}>Apply</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => openReturnModal(item)}
                                                    style={[styles.actionBtn, { backgroundColor: '#E67E22' }]}
                                                >
                                                    <Text style={styles.actionBtnText}>Return</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                        {item.status === 'Pending' && (
                                            <TouchableOpacity
                                                disabled
                                                style={[styles.actionBtn, { backgroundColor: colors.muted }]}
                                            >
                                                <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>Returned</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            )}

            {/* Apply Release Modal */}
            <Modal visible={applyModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.formModal, { backgroundColor: colors.card }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                                Apply Release — {selectedItem?.itemCode}
                            </Text>
                            <TouchableOpacity onPress={() => setApplyModalVisible(false)}>
                                <X size={20} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <View style={[styles.infoCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
                                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Item: <Text style={{ color: colors.foreground }}>{selectedItem?.itemCode}</Text></Text>
                                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Barcode: <Text style={{ color: colors.foreground }}>{selectedItem?.barcode}</Text></Text>
                            </View>

                            <DropdownField
                                label="Ticket"
                                placeholder="None"
                                options={['None', ...MOCK_DROPDOWN_DATA.tickets]}
                                value={applyTicket}
                                onSelect={setApplyTicket}
                            />
                            <DropdownField
                                label="Location"
                                required
                                placeholder="Select location..."
                                options={MOCK_DROPDOWN_DATA.locations}
                                value={applyLocation}
                                onSelect={setApplyLocation}
                            />

                            <View style={styles.formCol}>
                                <Text style={[styles.label, { color: colors.mutedForeground }]}>Quantity</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                                    value={applyQty}
                                    onChangeText={setApplyQty}
                                    keyboardType="numeric"
                                />
                                <Text style={{ fontSize: 10, color: colors.mutedForeground, marginTop: 4 }}>Max you can apply: {selectedItem?.issued}</Text>
                            </View>

                            <View style={styles.formCol}>
                                <Text style={[styles.label, { color: colors.mutedForeground }]}>Remarks</Text>
                                <TextInput
                                    style={[styles.textArea, { color: colors.foreground, borderColor: colors.border }]}
                                    value={applyRemarks}
                                    onChangeText={setApplyRemarks}
                                    placeholder="Add a note"
                                    placeholderTextColor={colors.mutedForeground}
                                    multiline
                                />
                            </View>
                        </ScrollView>
                        <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setApplyModalVisible(false)}>
                                <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={submitApply}>
                                <Text style={styles.submitBtnText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Return Items Modal */}
            <Modal visible={returnModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.formModal, { backgroundColor: colors.card, height: '80%' }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Return Items</Text>
                            <TouchableOpacity onPress={() => setReturnModalVisible(false)}>
                                <X size={20} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <View style={styles.modalGrid}>
                                <DropdownField label="Role" required placeholder="Select role" options={MOCK_DROPDOWN_DATA.roles} value={returnRole} onSelect={setReturnRole} />
                                <DropdownField label="User" required placeholder="Select user" options={MOCK_DROPDOWN_DATA.users} value={returnUser} onSelect={setReturnUser} />
                            </View>
                            <View style={styles.modalGrid}>
                                <DropdownField label="Project" placeholder="Select Project" options={MOCK_DROPDOWN_DATA.projects} value={returnProject} onSelect={setReturnProject} />
                                <DropdownField label="Location" placeholder="Select Location" options={MOCK_DROPDOWN_DATA.locations} value={returnLocation} onSelect={setReturnLocation} />
                            </View>
                            <DropdownField label="Ticket" placeholder="Select Ticket" options={MOCK_DROPDOWN_DATA.tickets} value={returnTicket} onSelect={setReturnTicket} />

                            <View style={styles.itemStrip}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Name</Text>
                                    <Text style={{ fontSize: 12, color: colors.foreground }} numberOfLines={1}>{selectedItem?.itemName}</Text>
                                </View>
                                <View style={{ width: 60 }}>
                                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Qty</Text>
                                    <TextInput style={styles.smallInput} value="1" keyboardType="numeric" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Remarks</Text>
                                    <TextInput style={styles.smallInput} placeholder="Remarks" placeholderTextColor={colors.mutedForeground} />
                                </View>
                            </View>
                        </ScrollView>
                        <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setReturnModalVisible(false)}>
                                <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={submitReturn}>
                                <Text style={styles.submitBtnText}>Submit Return</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

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
        paddingVertical: 0,
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
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    cell: { paddingRight: 10 },
    cellText: { fontSize: 12 },
    actionBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borderRadius.sm,
        minWidth: 60,
        alignItems: 'center',
    },
    actionBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    formModal: {
        borderRadius: borderRadius.lg,
        maxHeight: '90%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
    },
    modalTitle: { fontSize: 14, fontWeight: 'bold' },
    modalBody: { padding: spacing.md },
    modalGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
    infoCard: {
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    infoLabel: { fontSize: 12, marginBottom: 4, fontWeight: 'bold' },
    formCol: { marginBottom: spacing.md },
    label: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: borderRadius.md,
        paddingHorizontal: 12,
        fontSize: 13,
    },
    textArea: {
        height: 80,
        borderWidth: 1,
        borderRadius: borderRadius.md,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: spacing.md,
        borderTopWidth: 1,
        gap: spacing.md,
    },
    cancelBtn: { paddingVertical: 10, paddingHorizontal: 20 },
    cancelBtnText: { fontSize: 13, fontWeight: '600' },
    submitBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: borderRadius.md,
    },
    submitBtnText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderBottomWidth: 1,
    },
    modalContent: {
        width: '100%',
        maxHeight: '60%',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
    },
    itemStrip: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.md,
        alignItems: 'flex-end',
        paddingBottom: 20,
    },
    smallInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        height: 30,
        borderRadius: 4,
        fontSize: 11,
        paddingHorizontal: 4,
    }
});
