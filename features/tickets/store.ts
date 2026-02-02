// features/tickets/store.ts
import { create } from 'zustand';
import { Ticket, TicketStats } from './types';
import { MOCK_TICKETS } from '../../mock/data';

interface TicketsState {
    tickets: Ticket[];
    filteredTickets: Ticket[];
    stats: TicketStats;
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    activeFilter: string | null;

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
    isLoading: false,
    error: null,
    searchQuery: '',
    activeFilter: null,

    fetchTickets: async () => {
        set({ isLoading: true, error: null });
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const tickets = MOCK_TICKETS;

            // Calculate stats
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

            set({
                tickets,
                filteredTickets: tickets,
                stats,
                isLoading: false,
            });
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

        // Apply status filter first if active
        if (activeFilter) {
            filtered = filtered.filter(t =>
                activeFilter === 'open' ? (t.status === 'open' || t.status === 'inProgress') : t.status === activeFilter
            );
        }

        // Apply search
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

        // Apply search first if active
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(lowerQuery) ||
                t.ticketId.toLowerCase().includes(lowerQuery) ||
                t.siteName.toLowerCase().includes(lowerQuery)
            );
        }

        // Apply status filter
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
