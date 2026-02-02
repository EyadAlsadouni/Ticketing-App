// features/tickets/store.ts
import { create } from 'zustand';
import { Ticket, TicketStats } from './types';
import { MOCK_TICKETS, SLA_STATS, WEEKLY_PERFORMANCE } from '../../mock/data';

interface TicketsState {
    tickets: Ticket[];
    filteredTickets: Ticket[];
    stats: TicketStats;
    slaStats: any[]; // For chart kit
    weeklyPerformance: any; // For chart kit
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    activeFilter: string | null;
    refreshCount: number; // To force updates if needed

    // Actions
    fetchTickets: () => Promise<void>;
    searchTickets: (query: string) => void;
    filterByStatus: (status: string | null) => void;
    getTicketById: (id: number) => Ticket | undefined;
}

export const useTicketsStore = create<TicketsState>((set, get) => ({
    tickets: [],
    filteredTickets: [],
    stats: {
        total: 0,
        open: 0,
        closed: 0,
        suspended: 0,
        pending: 0,
    },
    slaStats: [],
    weeklyPerformance: null,
    isLoading: false,
    error: null,
    searchQuery: '',
    activeFilter: null,
    refreshCount: 0,

    fetchTickets: async () => {
        set({ isLoading: true, error: null });
        try {
            // Simulate API call with minor randomization to show "dynamic" behavior
            await new Promise(resolve => setTimeout(resolve, 800));

            const tickets = [...MOCK_TICKETS];

            // Calculate stats dynamically from the tickets
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

            set(state => ({
                tickets,
                filteredTickets: tickets,
                stats,
                slaStats: SLA_STATS, // In real app, calculate from tickets
                weeklyPerformance: WEEKLY_PERFORMANCE, // In real app, calculate dates
                isLoading: false,
                refreshCount: state.refreshCount + 1
            }));
        } catch (error) {
            set({
                error: 'Failed to fetch tickets',
                isLoading: false,
            });
        }
    },

    searchTickets: (query: string) => {
        const { tickets, activeFilter } = get();
        const lowerQuery = query.toLowerCase();

        let filtered = tickets;

        if (activeFilter) {
            filtered = filtered.filter(t =>
                activeFilter === 'open' ? (t.status === 'open' || t.status === 'inProgress') : t.status === activeFilter
            );
        }

        if (query) {
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(lowerQuery) ||
                t.ticketId.toLowerCase().includes(lowerQuery) ||
                t.siteName.toLowerCase().includes(lowerQuery) ||
                t.description.toLowerCase().includes(lowerQuery)
            );
        }

        set({ searchQuery: query, filteredTickets: filtered });
    },

    filterByStatus: (status: string | null) => {
        const { tickets, searchQuery } = get();

        let filtered = tickets;

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(lowerQuery) ||
                t.ticketId.toLowerCase().includes(lowerQuery) ||
                t.siteName.toLowerCase().includes(lowerQuery)
            );
        }

        if (status) {
            filtered = filtered.filter(t =>
                status === 'open' ? (t.status === 'open' || t.status === 'inProgress') : t.status === status
            );
        }

        set({ activeFilter: status, filteredTickets: filtered });
    },

    getTicketById: (id: number) => {
        return get().tickets.find(t => t.id === id);
    },
}));
