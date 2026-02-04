// features/tickets/types.ts

export type TicketStatus = 'open' | 'inProgress' | 'closed' | 'suspended' | 'pending';
export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | null;

export interface Attachment {
    id: number;
    type: string; // e.g., 'Status Closed'
    fileName: string;
    uploadedDate: string;
    fileSize?: string;
}

export interface TicketDependency {
    id: number;
    name: string;
    remarks: string;
    resolved: boolean;
}

export interface InventoryItem {
    id: number;
    name: string;
    barcode?: string;
    desc?: string;
    quantity: number;
    remarks?: string;
    consumedDate: string;
}

export interface ActivityLog {
    id: number;
    workDate: string;
    startTime: string;
    endTime: string;
    duration: string;
    activity: string; // e.g., 'PM', 'TR'
    status: string; // e.g., 'Closed'
    remoteVisit: boolean;
    distance?: string;
    hotelStay?: boolean;
    overtime?: boolean;
    remarks?: string;
}

export interface ActivityItem {
    id: number;
    type: 'STATUS_CHANGED' | 'ASSIGNEE_CHANGED' | 'TICKET_CREATED' | 'TITLE_CHANGED' | 'TITLE_ADDED';
    from?: string;
    to?: string;
    user: string;
    timestamp: string;
}

export interface Comment {
    id: number;
    user: string;
    text: string;
    timestamp: string;
    avatar?: string;
}

export interface ChatMessage {
    id: number;
    sender: string;
    role: 'engineer' | 'manager' | 'admin';
    text: string;
    timestamp: string;
}

export interface Ticket {
    id: number;
    ticketId: string; // TKT-1234
    title: string;
    type?: string; // e.g., 'Consumption', 'New ticket'
    description: string;

    // Statuses
    status: TicketStatus;
    approvalStatus: ApprovalStatus;
    priority: TicketPriority;

    // Locations
    siteName: string;
    region: string;
    city: string;
    locationDetails?: string; // e.g., 'Hoshani Building'

    // Dates (ISO strings)
    createdAt: string;
    updatedAt: string;
    startDate?: string;
    suspendedDate?: string;
    completedDate?: string;
    dueDate?: string;
    delayDays: number;

    // Relations
    assignee?: {
        id: number;
        name: string;
        role?: string; // e.g. 'Field Engineer'
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

    // Detailed Data
    inventoryConsumed?: InventoryItem[];
    dailyLogs?: ActivityLog[];
    activities?: ActivityItem[];
    dependencies?: TicketDependency[];
    attachments?: Attachment[];
    comments?: Comment[];
    chat?: ChatMessage[];
}

export interface TicketStats {
    total: number;
    open: number;
    closed: number;
    suspended: number;
    pending: number;
}
