// features/logs/store.ts
import { create } from 'zustand';
import { DailyLog, LogOverviewData } from './types';
import { MOCK_LOGS, MOCK_LOG_OVERVIEW } from '../../mock/data';

interface LogsState {
    logs: DailyLog[];
    overview: LogOverviewData;
    searchQuery: string;

    // Actions
    setSearchQuery: (query: string) => void;
    addLogRow: () => void;
    updateLogRow: (id: string, updates: Partial<DailyLog>) => void;
    deleteLogRow: (id: string) => void;
    saveLogRow: (id: string) => void;
    cancelEdit: (id: string) => void;
    attachDocument: (id: string, name: string) => void;
}

export const useLogsStore = create<LogsState>((set) => ({
    logs: MOCK_LOGS,
    overview: MOCK_LOG_OVERVIEW,
    searchQuery: '',

    setSearchQuery: (query) => set({ searchQuery: query }),

    addLogRow: () => set((state) => {
        const newLog: DailyLog = {
            id: Date.now().toString(),
            workDate: new Date().toISOString(),
            ticketId: null,
            siteId: '',
            activityCode: 'TR',
            startTime: '09:00 AM',
            endTime: '05:00 PM',
            remoteVisit: 'No',
            overtime: '',
            distance: '',
            remarks: '',
            hotelStay: 'No',
            approvalStatus: '',
            approvalRemarks: '',
            hasAttachment: false,
            isEditing: true,
            isNew: true,
        };
        return { logs: [newLog, ...state.logs] };
    }),

    updateLogRow: (id, updates) => set((state) => ({
        logs: state.logs.map((log) => log.id === id ? { ...log, ...updates } : log)
    })),

    deleteLogRow: (id) => set((state) => ({
        logs: state.logs.filter((log) => log.id !== id)
    })),

    saveLogRow: (id) => set((state) => ({
        logs: state.logs.map((log) =>
            log.id === id ? { ...log, isEditing: false, isNew: false } : log
        )
    })),

    cancelEdit: (id) => set((state) => {
        const log = state.logs.find(l => l.id === id);
        if (log?.isNew) {
            return { logs: state.logs.filter(l => l.id !== id) };
        }
        return {
            logs: state.logs.map(l => l.id === id ? { ...l, isEditing: false } : l)
        };
    }),

    attachDocument: (id: string, name: string) => set((state) => ({
        logs: state.logs.map((log) =>
            log.id === id ? { ...log, hasAttachment: true, attachmentName: name } : log
        )
    })),
}));
