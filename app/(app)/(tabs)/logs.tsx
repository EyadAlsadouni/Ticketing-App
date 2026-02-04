// app/(app)/(tabs)/logs.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../../shared/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../shared/theme';
import { Search, Plus, Save, X, Edit2, Trash2, Calendar as CalendarIcon, Clock, ChevronDown, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { LOG_PICKLISTS } from '../../../mock/data';
import { useLogsStore } from '../../../features/logs/store';
import { DailyLog } from '../../../features/logs/types';

export default function LogsScreen() {
    const { colors } = useTheme();
    const {
        logs,
        overview,
        searchQuery,
        setSearchQuery,
        addLogRow,
        updateLogRow,
        deleteLogRow,
        saveLogRow,
        cancelEdit,
        attachDocument
    } = useLogsStore();

    const [selectedField, setSelectedField] = useState<{ logId: string, field: keyof DailyLog, options: { label: string, value: string }[] } | null>(null);
    const [datePickerVisible, setDatePickerVisible] = useState<{ logId: string, value: string } | null>(null);
    const [timePickerVisible, setTimePickerVisible] = useState<{ logId: string, field: 'startTime' | 'endTime', value: string } | null>(null);

    const handleAttach = async (logId: string) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true
            });
            if (!result.canceled) {
                attachDocument(logId, result.assets[0].name);
            }
        } catch (err) {
            console.error('Pick document error:', err);
        }
    };

    const filteredLogs = logs.filter(log =>
    (log.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.approvalStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        LOG_PICKLISTS.sites.find(s => s.value === log.siteId)?.label.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateLong = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderEditableCell = (log: DailyLog, field: keyof DailyLog, options?: { label: string, value: string }[]) => {
        if (!log.isEditing) {
            const displayValue = options ? options.find(o => o.value === log[field])?.label : String(log[field] || '-');
            return <Text style={[styles.cellText, { color: colors.foreground }]}>{displayValue || '-'}</Text>;
        }

        if (options) {
            return (
                <TouchableOpacity
                    onPress={() => setSelectedField({ logId: log.id, field, options })}
                    style={[styles.pickerContainer, { backgroundColor: colors.muted + '40', borderColor: colors.border }]}
                >
                    <Text style={[styles.pickerValue, { color: colors.foreground }]} numberOfLines={1}>
                        {options.find(o => o.value === log[field])?.label || 'Select..'}
                    </Text>
                    <ChevronDown size={14} color={colors.mutedForeground} />
                </TouchableOpacity>
            );
        }

        return (
            <TextInput
                style={[styles.cellInput, { color: colors.foreground, backgroundColor: colors.muted + '40', borderColor: colors.border }]}
                value={String(log[field] || '')}
                onChangeText={(text) => updateLogRow(log.id, { [field]: text })}
                placeholder="..."
                placeholderTextColor={colors.mutedForeground}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Selection Modal */}
            <Modal
                visible={!!selectedField}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedField(null)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSelectedField(null)}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={[styles.modalTitle, { color: colors.foreground }]}>Select Option</Text>
                        <ScrollView style={styles.modalScroll}>
                            {selectedField?.options.map(option => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[styles.optionItem, { borderBottomColor: colors.border }]}
                                    onPress={() => {
                                        updateLogRow(selectedField.logId, { [selectedField.field]: option.value });
                                        setSelectedField(null);
                                    }}
                                >
                                    <Text style={[styles.optionText, { color: colors.foreground }]}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Button variant="ghost" onPress={() => setSelectedField(null)}>
                            <Text style={{ color: colors.primary }}>Cancel</Text>
                        </Button>
                    </View>
                </TouchableOpacity>
            </Modal>

            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.foreground }]}>Daily Activity Logs</Text>
                <Button
                    variant="default"
                    size="sm"
                    onPress={addLogRow}
                    style={styles.addButton}
                >
                    <Plus size={16} color="#fff" />
                    <Text style={styles.addButtonText}>Add Row</Text>
                </Button>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Search size={20} color={colors.mutedForeground} />
                <TextInput
                    style={[styles.searchInput, { color: colors.foreground }]}
                    placeholder="Search logs..."
                    placeholderTextColor={colors.mutedForeground}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.tableWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View style={styles.table}>
                        <View style={[styles.tableHeader, { backgroundColor: colors.muted + '20' }]}>
                            <Text style={[styles.headerCell, { width: 140 }]}>WORK DATE *</Text>
                            <Text style={[styles.headerCell, { width: 120 }]}>TICKET</Text>
                            <Text style={[styles.headerCell, { width: 220 }]}>SITE *</Text>
                            <Text style={[styles.headerCell, { width: 100 }]}>ACTIVITY</Text>
                            <Text style={[styles.headerCell, { width: 120 }]}>START TIME *</Text>
                            <Text style={[styles.headerCell, { width: 120 }]}>END TIME *</Text>
                            <Text style={[styles.headerCell, { width: 120 }]}>REMOTE VISIT *</Text>
                            <Text style={[styles.headerCell, { width: 100 }]}>OVERTIME</Text>
                            <Text style={[styles.headerCell, { width: 100 }]}>DISTANCE</Text>
                            <Text style={[styles.headerCell, { width: 180 }]}>REMARKS</Text>
                            <Text style={[styles.headerCell, { width: 100 }]}>HOTEL STAY</Text>
                            <Text style={[styles.headerCell, { width: 200 }]}>APPROVAL</Text>
                            <Text style={[styles.headerCell, { width: 130 }]}>ACTIONS</Text>
                        </View>

                        <ScrollView style={{ flex: 1 }}>
                            {filteredLogs.map(log => (
                                <View
                                    key={log.id}
                                    style={[
                                        styles.row,
                                        { borderBottomColor: colors.border },
                                        log.isEditing && { backgroundColor: colors.primary + '08' }
                                    ]}
                                >
                                    {/* Work Date */}
                                    <View style={[styles.cell, { width: 140 }]}>
                                        {log.isEditing ? (
                                            <TouchableOpacity
                                                onPress={() => setDatePickerVisible({ logId: log.id, value: log.workDate })}
                                                style={[styles.datePicker, { backgroundColor: colors.muted + '40', borderColor: colors.border }]}
                                            >
                                                <Text style={{ fontSize: 12, color: colors.foreground }}>{formatDate(log.workDate)}</Text>
                                                <CalendarIcon size={14} color={colors.mutedForeground} />
                                            </TouchableOpacity>
                                        ) : (
                                            <Text style={[styles.cellText, { color: colors.foreground }]}>{formatDateLong(log.workDate)}</Text>
                                        )}
                                    </View>

                                    {/* Ticket */}
                                    <View style={[styles.cell, { width: 120 }]}>
                                        {renderEditableCell(log, 'ticketId', LOG_PICKLISTS.tickets)}
                                    </View>

                                    {/* Site */}
                                    <View style={[styles.cell, { width: 220 }]}>
                                        {renderEditableCell(log, 'siteId', LOG_PICKLISTS.sites)}
                                    </View>

                                    {/* Activity */}
                                    <View style={[styles.cell, { width: 100 }]}>
                                        {renderEditableCell(log, 'activityCode', LOG_PICKLISTS.activities)}
                                    </View>

                                    {/* Start Time */}
                                    <View style={[styles.cell, { width: 120 }]}>
                                        {log.isEditing ? (
                                            <TouchableOpacity
                                                onPress={() => setTimePickerVisible({ logId: log.id, field: 'startTime', value: log.startTime })}
                                                style={[styles.datePicker, { backgroundColor: colors.muted + '40', borderColor: colors.border }]}
                                            >
                                                <Text style={{ fontSize: 12, color: colors.foreground }}>{log.startTime}</Text>
                                                <Clock size={14} color={colors.mutedForeground} />
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={[styles.timeTag, { backgroundColor: colors.primary + '15' }]}>
                                                <Text style={[styles.timeText, { color: colors.primary }]}>{log.startTime}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* End Time */}
                                    <View style={[styles.cell, { width: 120 }]}>
                                        {log.isEditing ? (
                                            <TouchableOpacity
                                                onPress={() => setTimePickerVisible({ logId: log.id, field: 'endTime', value: log.endTime })}
                                                style={[styles.datePicker, { backgroundColor: colors.muted + '40', borderColor: colors.border }]}
                                            >
                                                <Text style={{ fontSize: 12, color: colors.foreground }}>{log.endTime}</Text>
                                                <Clock size={14} color={colors.mutedForeground} />
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={[styles.timeTag, { backgroundColor: '#a855f7' + '15' }]}>
                                                <Text style={[styles.timeText, { color: '#a855f7' }]}>{log.endTime}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Remote Visit */}
                                    <View style={[styles.cell, { width: 120 }]}>
                                        {renderEditableCell(log, 'remoteVisit', [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }])}
                                    </View>

                                    {/* Overtime */}
                                    <View style={[styles.cell, { width: 100 }]}>
                                        {renderEditableCell(log, 'overtime')}
                                    </View>

                                    {/* Distance */}
                                    <View style={[styles.cell, { width: 100 }]}>
                                        {renderEditableCell(log, 'distance')}
                                    </View>

                                    {/* Remarks */}
                                    <View style={[styles.cell, { width: 180 }]}>
                                        {renderEditableCell(log, 'remarks')}
                                    </View>

                                    {/* Hotel Stay */}
                                    <View style={[styles.cell, { width: 100 }]}>
                                        {renderEditableCell(log, 'hotelStay', [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }])}
                                    </View>

                                    {/* Approval */}
                                    <View style={[styles.cell, { width: 200 }]}>
                                        {log.approvalStatus ? (
                                            <View style={[
                                                styles.approvalBadge,
                                                { backgroundColor: log.approvalStatus.includes('Approved') ? '#dcfce7' : (log.approvalStatus.includes('Pending') ? '#fef9c3' : '#fee2e2') }
                                            ]}>
                                                <Text style={[
                                                    styles.approvalText,
                                                    { color: log.approvalStatus.includes('Approved') ? '#166534' : (log.approvalStatus.includes('Pending') ? '#854d0e' : '#991b1b') }
                                                ]}>{log.approvalStatus}</Text>
                                            </View>
                                        ) : (
                                            <View style={[styles.approvalBadge, { backgroundColor: '#fef9c3' }]}>
                                                <Text style={[styles.approvalText, { color: '#854d0e' }]}>Pending</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Actions */}
                                    <View style={[styles.cell, { width: 130, flexDirection: 'row', gap: 12, alignItems: 'center' }]}>
                                        {log.isEditing ? (
                                            <>
                                                <TouchableOpacity onPress={() => saveLogRow(log.id)}>
                                                    <Save size={18} color="#22c55e" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => cancelEdit(log.id)}>
                                                    <X size={18} color="#ef4444" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleAttach(log.id)}>
                                                    <Paperclip size={18} color={log.hasAttachment ? "#22c55e" : colors.primary} />
                                                </TouchableOpacity>
                                            </>
                                        ) : log.approvalStatus.includes('Approved') ? (
                                            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                                {log.hasAttachment && <Paperclip size={18} color="#94a3b8" />}
                                                <Text style={{ fontSize: 10, color: colors.mutedForeground, fontStyle: 'italic' }}>Locked</Text>
                                            </View>
                                        ) : (
                                            <>
                                                <TouchableOpacity onPress={() => updateLogRow(log.id, { isEditing: true })}>
                                                    <Edit2 size={18} color={colors.primary} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => deleteLogRow(log.id)}>
                                                    <Trash2 size={18} color="#ef4444" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleAttach(log.id)}>
                                                    <Paperclip size={18} color={log.hasAttachment ? "#22c55e" : colors.primary} />
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.overview}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.overviewContent}>
                    <OverviewCard label="Total Activities" value={overview.totalActivities} color={colors.primary} />
                    <OverviewCard label="Total Hours" value={overview.totalHours} color="#22c55e" unit="(Approved)" />
                    <OverviewCard label="Total Distance" value={overview.totalDistance} color="#a855f7" unit="(Approved)" />
                    <OverviewCard label="Approved Overtime" value={overview.approvedOvertime} color="#f97316" />
                    <OverviewCard label="Hotel Nights" value={overview.hotelNights} color="#3b82f6" />
                    <OverviewCard label="BTR Eligible Days" value={overview.btrEligibleDays} color="#10b981" />
                </ScrollView>
            </View>

            {/* Custom Date Picker */}
            {datePickerVisible && (
                <DatePickerModal
                    visible={!!datePickerVisible}
                    value={datePickerVisible.value}
                    onClose={() => setDatePickerVisible(null)}
                    onSelect={(date) => {
                        updateLogRow(datePickerVisible.logId, { workDate: date });
                        setDatePickerVisible(null);
                    }}
                />
            )}

            {/* Custom Time Picker */}
            {timePickerVisible && (
                <TimePickerModal
                    visible={!!timePickerVisible}
                    value={timePickerVisible.value}
                    onClose={() => setTimePickerVisible(null)}
                    onSelect={(time) => {
                        updateLogRow(timePickerVisible.logId, { [timePickerVisible.field]: time });
                        setTimePickerVisible(null);
                    }}
                />
            )}
        </View>
    );
}

// Sub-components for Pickers
function DatePickerModal({ visible, value, onClose, onSelect }: { visible: boolean, value: string, onClose: () => void, onSelect: (date: string) => void }) {
    const { colors } = useTheme();
    const currentDate = new Date(value);
    const [viewDate, setViewDate] = useState(new Date(value));

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const padding = Array.from({ length: firstDayOfMonth }, (_, i) => null);

    const monthName = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
                <View style={[styles.calendarModal, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}>
                            <ChevronLeft size={20} color={colors.foreground} />
                        </TouchableOpacity>
                        <Text style={[styles.calendarTitle, { color: colors.foreground }]}>{monthName}</Text>
                        <TouchableOpacity onPress={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}>
                            <ChevronRight size={20} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekDaysRow}>
                        {weekDays.map(day => <Text key={day} style={styles.weekDayText}>{day}</Text>)}
                    </View>

                    <View style={styles.daysGrid}>
                        {padding.map((_, i) => <View key={`pad-${i}`} style={styles.dayCell} />)}
                        {days.map(day => {
                            const isSelected = currentDate.getDate() === day && currentDate.getMonth() === viewDate.getMonth() && currentDate.getFullYear() === viewDate.getFullYear();
                            return (
                                <TouchableOpacity
                                    key={day}
                                    style={[styles.dayCell, isSelected && { backgroundColor: colors.primary, borderRadius: 100 }]}
                                    onPress={() => {
                                        const newDate = new Date(viewDate);
                                        newDate.setDate(day);
                                        onSelect(newDate.toISOString());
                                    }}
                                >
                                    <Text style={[styles.dayText, { color: isSelected ? '#fff' : colors.foreground }]}>{day}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.calendarFooter}>
                        <TouchableOpacity onPress={onClose}><Text style={{ color: colors.primary }}>Clear</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => onSelect(new Date().toISOString())}><Text style={{ color: colors.primary }}>Today</Text></TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

function TimePickerModal({ visible, value, onClose, onSelect }: { visible: boolean, value: string, onClose: () => void, onSelect: (time: string) => void }) {
    const { colors } = useTheme();

    // Safety check for value format
    const timeParts = value.includes(':') ? value.split(':') : ["09", "00 AM"];
    const initialHour = timeParts[0];
    const initialMinAmpm = timeParts[1]?.split(' ') || ["00", "AM"];

    const [hour, setHour] = useState(initialHour);
    const [minute, setMinute] = useState(initialMinAmpm[0]);
    const [ampm, setAmPm] = useState(initialMinAmpm[1] || "AM");

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
                <View style={[styles.timePickerModal, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.timePickerRow}>
                        <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                            {hours.map(h => (
                                <TouchableOpacity key={h} style={[styles.pickerItem, hour === h && { backgroundColor: colors.primary }]} onPress={() => setHour(h)}>
                                    <Text style={[styles.pickerItemText, { color: hour === h ? '#fff' : colors.foreground }]}>{h}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                            {minutes.map(m => (
                                <TouchableOpacity key={m} style={[styles.pickerItem, minute === m && { backgroundColor: colors.primary }]} onPress={() => setMinute(m)}>
                                    <Text style={[styles.pickerItemText, { color: minute === m ? '#fff' : colors.foreground }]}>{m}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={styles.pickerColumn}>
                            {['AM', 'PM'].map(p => (
                                <TouchableOpacity key={p} style={[styles.pickerItem, ampm === p && { backgroundColor: colors.primary }]} onPress={() => setAmPm(p)}>
                                    <Text style={[styles.pickerItemText, { color: ampm === p ? '#fff' : colors.foreground }]}>{p}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <Button variant="default" style={{ marginTop: spacing.md }} onPress={() => onSelect(`${hour}:${minute} ${ampm}`)}>
                        Done
                    </Button>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

function OverviewCard({ label, value, color, unit }: { label: string, value: string | number, color: string, unit?: string }) {
    const { colors } = useTheme();
    return (
        <Card style={styles.statCard}>
            <View style={{ alignItems: 'center' }}>
                <Text style={[styles.statValue, { color }]}>{value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
                {unit && <Text style={[styles.statUnit, { color: colors.mutedForeground }]}>{unit}</Text>}
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
    },
    addButton: {
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: spacing.lg,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: fontSize.sm,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        height: 48,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        marginBottom: spacing.lg,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: fontSize.base,
    },
    tableWrapper: {
        flex: 1,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
    },
    table: {
        // minWidth handled by headerCell widths sum
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
    },
    headerCell: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b',
        paddingHorizontal: spacing.md,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    cell: {
        paddingHorizontal: spacing.md,
    },
    cellText: {
        fontSize: 13,
        fontWeight: '500',
    },
    cellInput: {
        height: 36,
        borderRadius: 6,
        borderWidth: 1,
        paddingHorizontal: 8,
        fontSize: 13,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 36,
        borderRadius: 6,
        borderWidth: 1,
        paddingHorizontal: 8,
    },
    pickerValue: {
        fontSize: 12,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 36,
        paddingHorizontal: 10,
        borderRadius: 6,
        borderWidth: 1,
        gap: 8,
    },
    timeTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    timeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    approvalBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    approvalText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    overview: {
        marginTop: spacing.lg,
        paddingVertical: spacing.sm,
    },
    overviewContent: {
        paddingRight: spacing.xl,
    },
    statCard: {
        minWidth: 130,
        marginRight: spacing.md,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    statValue: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 4,
    },
    statUnit: {
        fontSize: 9,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        width: '100%',
        maxHeight: '70%',
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        padding: spacing.lg,
    },
    modalTitle: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        marginBottom: spacing.md,
    },
    modalScroll: {
        marginBottom: spacing.md,
    },
    optionItem: {
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: fontSize.base,
    },
    calendarModal: {
        width: 320,
        borderRadius: 16,
        padding: spacing.lg,
        borderWidth: 1,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    calendarTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.sm,
    },
    weekDayText: {
        width: 36,
        textAlign: 'center',
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayCell: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
        marginHorizontal: 1,
    },
    dayText: {
        fontSize: 14,
    },
    calendarFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    timePickerModal: {
        width: 280,
        borderRadius: 16,
        padding: spacing.lg,
        borderWidth: 1,
    },
    timePickerRow: {
        flexDirection: 'row',
        height: 180,
    },
    pickerColumn: {
        flex: 1,
    },
    pickerItem: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 2,
    },
    pickerItemText: {
        fontSize: 16,
        fontWeight: '500',
    }
});
