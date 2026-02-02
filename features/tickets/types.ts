// features/tickets/types.ts
// Ticket types for the mobile app

export type TicketStatus = 'open' | 'inProgress' | 'closed' | 'suspended' | 'pending';
export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Ticket {
    id: number;
    ticketId: string; // Display ID like TKT-1234
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;

    // Locations
    siteName: string;
    region: string;
    city: string;

    // Dates (ISO strings)
    createdAt: string;
    updatedAt: string;
    dueDate?: string;

    // Relations
    assignee?: {
        id: number;
        name: string;
        avatar?: string;
    };
    reporter: {
        id: number;
        name: string;
    };

    // Metadata
    projectName: string;
    slaStatus: 'met' | 'breached' | 'warning';
    commentsCount: number;
    attachmentsCount: number;
}

export interface TicketStats {
    total: number;
    open: number;
    closed: number;
    suspended: number;
    pending: number;
}
