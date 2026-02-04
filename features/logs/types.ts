// features/logs/types.ts

export type LogStatus = 'Approved' | 'Pending' | 'Rejected' | 'Draft';

export interface DailyLog {
    id: string;
    workDate: string; // ISO format
    ticketId: string | null;
    siteId: string;
    activityCode: 'TR' | 'PM' | 'WF' | 'Other';
    startTime: string; // HH:mm AM/PM
    endTime: string; // HH:mm AM/PM
    remoteVisit: 'Yes' | 'No';
    overtime: string; // HH:mm
    distance: string; // km
    remarks: string;
    hotelStay: 'Yes' | 'No';
    approvalStatus: string; // e.g., 'Approved By Supervisor'
    approvalRemarks: string;
    hasAttachment: boolean;
    attachmentName?: string;
    isEditing?: boolean;
    isNew?: boolean;
}

export interface LogOverviewData {
    totalActivities: number;
    totalHours: string;
    totalDistance: string;
    approvedOvertime: string;
    hotelNights: number;
    btrEligibleDays: number;
}
