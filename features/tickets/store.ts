// features/tickets/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ticket, TicketStats } from './types';
import { MOCK_TICKETS, SLA_STATS, WEEKLY_PERFORMANCE } from '../../mock/data';

interface TicketsState {
    tickets: Ticket[];
    filteredTickets: Ticket[];
    stats: TicketStats;
    slaStats: any[];
    weeklyPerformance: any;
    isLoading: boolean;
    error: string | null;

    // Filters
    searchQuery: string;
    activeStatusFilter: string | null;
    activeApprovalFilter: string | null;
    refreshCount: number;

    // Actions
    fetchTickets: () => Promise<void>;
    searchTickets: (query: string) => void;
    filterByStatus: (status: string | null) => void;
    filterByApproval: (status: string | null) => void;
    updateTicketStatus: (id: number, newStatus: string) => Promise<void>;
    bulkUpdateTickets: (ids: number[], updates: Partial<Ticket>) => Promise<void>;
    getTicketById: (id: number) => Ticket | undefined;
    applyFilters: () => void;
}

const PRIORITY_ORDER: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
};

export const useTicketsStore = create<TicketsState>()(
    persist(
        (set, get) => ({
            tickets: [],
            filteredTickets: [],
            stats: {
                total: 0,
                open: 0,
                closed: 0,
                suspended: 0,
                pending: 0,
            },
            slaStats: SLA_STATS,
            weeklyPerformance: WEEKLY_PERFORMANCE,
            isLoading: false,
            error: null,
            searchQuery: '',
            activeStatusFilter: null,
            activeApprovalFilter: null,
            refreshCount: 0,

            fetchTickets: async () => {
                const existingTickets = get().tickets;

                // If we already have tickets, merge them with MOCK_TICKETS to get new rich fields (attachments, history, etc.)
                if (existingTickets.length > 0) {
                    const mergedTickets = existingTickets.map(existing => {
                        const mock = MOCK_TICKETS.find(m => m.id === existing.id);
                        if (mock) {
                            return {
                                ...mock, // Use mock as base to get new fields
                                ...existing, // Overwrite with user's persisted status/priority
                                // Merge arrays: if existing has data, keep it; otherwise take from mock
                                attachments: (existing.attachments?.length || 0) > 0 ? existing.attachments : mock.attachments,
                                dependencies: (existing.dependencies?.length || 0) > 0 ? existing.dependencies : mock.dependencies,
                                inventoryConsumed: (existing.inventoryConsumed?.length || 0) > 0 ? existing.inventoryConsumed : mock.inventoryConsumed,
                                dailyLogs: (existing.dailyLogs?.length || 0) > 0 ? existing.dailyLogs : mock.dailyLogs,
                                activities: (existing.activities?.length || 0) > 0 ? existing.activities : mock.activities,
                            };
                        }
                        return existing;
                    });

                    set({ tickets: mergedTickets });
                    get().applyFilters();
                    return;
                }

                set({ isLoading: true, error: null });
                try {
                    await new Promise(resolve => setTimeout(resolve, 800));

                    const tickets = [...MOCK_TICKETS];

                    // Sort by Priority (Critical first)
                    tickets.sort((a, b) => PRIORITY_ORDER[a.priority as string] - PRIORITY_ORDER[b.priority as string]);

                    set(state => ({
                        tickets,
                        filteredTickets: tickets,
                        isLoading: false,
                        refreshCount: state.refreshCount + 1
                    }));

                    get().applyFilters();
                } catch (error) {
                    set({
                        error: 'Failed to fetch tickets',
                        isLoading: false,
                    });
                }
            },

            searchTickets: (query: string) => {
                set({ searchQuery: query });
                get().applyFilters();
            },

            filterByStatus: (status: string | null) => {
                set({ activeStatusFilter: status === 'All Statuses' ? null : status });
                get().applyFilters();
            },

            filterByApproval: (status: string | null) => {
                set({ activeApprovalFilter: status === 'All Approval Statuses' ? null : status });
                get().applyFilters();
            },

            applyFilters: () => {
                const { tickets, searchQuery, activeStatusFilter, activeApprovalFilter } = get();
                let filtered = [...tickets];

                // 1. Search Query
                if (searchQuery) {
                    const lowerQuery = searchQuery.toLowerCase();
                    filtered = filtered.filter(t =>
                        t.title.toLowerCase().includes(lowerQuery) ||
                        t.ticketId.toLowerCase().includes(lowerQuery) ||
                        t.siteName.toLowerCase().includes(lowerQuery)
                    );
                }

                // 2. Status Filter
                if (activeStatusFilter) {
                    const filterLower = activeStatusFilter.toLowerCase();
                    filtered = filtered.filter(t => {
                        if (filterLower === 'open') return t.status === 'open' || t.status === 'inProgress';
                        return t.status === filterLower;
                    });
                }

                // 3. Approval Filter
                if (activeApprovalFilter) {
                    const filterLower = activeApprovalFilter.toLowerCase();
                    filtered = filtered.filter(t => t.approvalStatus === filterLower);
                }

                // Update Stats whenever tickets change or filtered
                const stats = tickets.reduce(
                    (acc, ticket) => {
                        acc.total++;
                        if (ticket.status === 'open' || ticket.status === 'inProgress') acc.open++;
                        else if (ticket.status === 'closed') acc.closed++;
                        else if (ticket.status === 'suspended') acc.suspended++;
                        else if (ticket.status === 'pending') acc.pending++;
                        return acc;
                    },
                    { total: 0, open: 0, closed: 0, suspended: 0, pending: 0 }
                );

                set({ filteredTickets: filtered, stats });
            },

            getTicketById: (id: number) => {
                return get().tickets.find(t => t.id === id);
            },

            updateTicketStatus: async (id: number, newStatus: string) => {
                const { tickets } = get();
                const updatedTickets = tickets.map(t =>
                    t.id === id ? { ...t, status: newStatus as any } : t
                );

                updatedTickets.sort((a, b) => PRIORITY_ORDER[a.priority as string] - PRIORITY_ORDER[b.priority as string]);

                set({ tickets: updatedTickets });
                get().applyFilters();
            },

            bulkUpdateTickets: async (ids: number[], updates: Partial<Ticket>) => {
                const { tickets } = get();
                const updatedTickets = tickets.map(t =>
                    ids.includes(t.id) ? { ...t, ...updates } : t
                );

                updatedTickets.sort((a, b) => PRIORITY_ORDER[a.priority as string] - PRIORITY_ORDER[b.priority as string]);

                set({ tickets: updatedTickets });
                get().applyFilters();
            }
        }),
        {
            name: 'tickets-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ tickets: state.tickets }),
        }
    )
);
