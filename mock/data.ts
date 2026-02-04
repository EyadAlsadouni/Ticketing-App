// mock/data.ts
import { Ticket } from '../features/tickets/types';
import { DailyLog, LogOverviewData } from '../features/logs/types';

// Utils
const now = new Date();
const subtractDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

// Mock Data for Saudi Arabia Context
export const MOCK_TICKETS: Ticket[] = [
    {
        id: 1,
        ticketId: '2576',
        title: 'Camera is broken',
        type: 'TR',
        description: 'Main entrance camera lens is cracked.',
        status: 'open',
        approvalStatus: null,
        priority: 'critical',
        siteName: 'AljabrGas station',
        locationDetails: 'Petrol gas station 1',
        region: 'Riyadh',
        city: 'Riyadh',
        createdAt: '2026-01-05T08:56:00Z',
        updatedAt: subtractDays(0),
        startDate: '2026-01-01T09:00:00Z',
        delayDays: 0,
        assignee: { id: 101, name: 'Ahmed Al-Sayed', role: 'Field Engineer' },
        reporter: { id: 201, name: 'Mohammed Ali' },
        projectName: 'Security Systems',
        slaStatus: 'met',
        commentsCount: 3,
        attachmentsCount: 1,
        attachments: [
            { id: 1, type: 'PNG', fileName: 'broken_camera_1.png', uploadedDate: '2026-01-05T09:12:00Z', fileSize: 'PNG' }
        ],
        dependencies: [
            { id: 1, name: 'Permit Required', remarks: 'Checking with station manager', resolved: false }
        ],
        inventoryConsumed: [
            { id: 1, name: 'Hikvision 4K Dome Camera', barcode: 'HK-9982', desc: 'Replacement Unit', quantity: 1, consumedDate: '2026-01-05T14:30:00Z' }
        ],
        dailyLogs: [
            { id: 1, workDate: '2026-01-05T00:00:00Z', startTime: '09:00', endTime: '18:00', duration: '9 hrs', activity: 'WF', status: 'In Progress', remoteVisit: false, distance: '0 km', hotelStay: false }
        ],
        activities: [
            { id: 1, type: 'TICKET_CREATED', user: 'Administrator', timestamp: '2026-01-05T08:56:00Z' }
        ],
        chat: [
            { id: 1, sender: 'Manager', role: 'manager', text: 'Ahmed, please update the status once the camera is replaced.', timestamp: '2026-01-05T09:00:00Z' },
            { id: 2, sender: 'Ahmed Al-Sayed', role: 'engineer', text: 'Sure, I am heading there now.', timestamp: '2026-01-05T09:05:00Z' },
            { id: 3, sender: 'Ahmed Al-Sayed', role: 'engineer', text: 'I replaced the lens but the focus is still blurry.', timestamp: '2026-01-05T14:30:00Z' },
            { id: 4, sender: 'Manager', role: 'manager', text: 'Try to recalibrate the software settings first.', timestamp: '2026-01-05T14:35:00Z' }
        ]
    },
    {
        id: 2,
        ticketId: 'AMB-3011',
        title: 'Network maintenance',
        description: 'Routine maintenance check for the main switch.',
        status: 'open',
        approvalStatus: null,
        priority: 'high',
        siteName: 'Hassani Building',
        locationDetails: 'Hassani Building',
        region: 'Riyadh',
        city: 'Riyadh',
        createdAt: '2026-01-20T10:00:00Z',
        updatedAt: subtractDays(1),
        delayDays: 0,
        assignee: { id: 101, name: 'Ahmed Al-Sayed', role: 'Field Engineer' },
        reporter: { id: 202, name: 'Omar Farooq' },
        projectName: 'Maintenance',
        slaStatus: 'met',
        commentsCount: 0,
        attachmentsCount: 0,
        dependencies: [],
        inventoryConsumed: [],
        dailyLogs: [],
        activities: [
            { id: 1, type: 'TICKET_CREATED', user: 'Omar Farooq', timestamp: '2026-01-20T10:00:00Z' }
        ],
        chat: []
    },
    {
        id: 3,
        ticketId: '2579',
        title: 'Drive up network issue',
        type: 'TR',
        description: 'Network outage in sector 4. Site needs inspection.',
        status: 'open',
        approvalStatus: null,
        priority: 'high',
        siteName: 'Main road drive up alhassa',
        locationDetails: 'Main road drive up alhassa',
        region: 'Eastern Province',
        city: 'Al-Hasa',
        createdAt: '2026-01-04T09:48:00Z',
        updatedAt: subtractDays(1),
        delayDays: 0,
        assignee: { id: 101, name: 'Ahmed Al-Sayed', role: 'Field Engineer' },
        reporter: { id: 203, name: 'Fahad Al-Otaibi' },
        projectName: 'Network',
        slaStatus: 'met',
        commentsCount: 2,
        attachmentsCount: 1,
        attachments: [],
        dependencies: [
            { id: 1, name: 'Power Issue', remarks: 'global power shutdown', resolved: false },
            { id: 2, name: 'Network Issue', remarks: 'No network available on site', resolved: false }
        ],
        inventoryConsumed: [
            {
                id: 1,
                name: 'AC-DC Power, -25degC, 60degC, 90V, 290V, 12V/29.2',
                barcode: '02131212',
                desc: '122025-00814',
                quantity: 1,
                consumedDate: '2026-01-04T09:49:00Z'
            },
            {
                id: 2,
                name: 'Assembly Chassis, AR6300, AR6300, AR6300 integrated chassis, 2*SRU slot, 4*SIC slot, 2*WSIC slot, 4*XSIC slot, 2*power slot',
                barcode: '02115640',
                desc: '122025-00647',
                quantity: 1,
                consumedDate: '2026-01-04T14:14:00Z'
            }
        ],
        dailyLogs: [],
        activities: [
            { id: 1, type: 'ASSIGNEE_CHANGED', from: 'Supervisor', to: 'Field Engineer', user: 'Supervisor', timestamp: '2026-01-04T14:14:00Z' },
            { id: 2, type: 'ASSIGNEE_CHANGED', from: 'Field Engineer', to: 'Supervisor', user: 'Administrator', timestamp: '2026-01-04T11:59:00Z' },
            { id: 3, type: 'STATUS_CHANGED', from: 'Suspended', to: 'Open', user: 'Administrator', timestamp: '2026-01-04T11:59:00Z' },
            { id: 4, type: 'STATUS_CHANGED', from: 'Open', to: 'Suspended', user: 'Field Engineer', timestamp: '2026-01-04T10:50:00Z' },
            { id: 5, type: 'STATUS_CHANGED', from: 'Suspended', to: 'Open', user: 'Administrator', timestamp: '2026-01-04T10:26:00Z' },
            { id: 6, type: 'STATUS_CHANGED', from: 'Open', to: 'Suspended', user: 'Field Engineer', timestamp: '2026-01-04T09:49:00Z' },
            { id: 7, type: 'TITLE_CHANGED', from: 'New', to: 'New ticket', user: 'Field Engineer', timestamp: '2026-01-04T09:48:00Z' },
            { id: 8, type: 'ASSIGNEE_CHANGED', from: 'Supervisor', to: 'Field Engineer', user: 'Supervisor', timestamp: '2026-01-04T09:48:00Z' },
            { id: 9, type: 'TITLE_ADDED', to: 'New', user: 'Supervisor', timestamp: '2026-01-04T09:48:00Z' }
        ],
        chat: [
            { id: 1, sender: 'Manager', role: 'manager', text: 'Any update on the sector 4 power outage?', timestamp: '2026-01-04T10:00:00Z' },
            { id: 2, sender: 'Ahmed Al-Sayed', role: 'engineer', text: 'Checking the main transformer now, seems like a major fault.', timestamp: '2026-01-04T10:05:00Z' }
        ]
    },
    {
        id: 4,
        ticketId: '2586',
        title: 'AC unit fix',
        description: 'AC Unit malfunction in building B.',
        status: 'suspended',
        approvalStatus: null,
        priority: 'medium',
        siteName: 'Abwdbyl drive up',
        locationDetails: 'Abwdbyl drive up',
        region: 'Jeddah',
        city: 'Jeddah',
        createdAt: '2026-01-10T11:00:00Z',
        updatedAt: subtractDays(2),
        suspendedDate: '2026-01-15T15:00:00Z',
        delayDays: 0,
        assignee: { id: 101, name: 'Ahmed Al-Sayed', role: 'Field Engineer' },
        reporter: { id: 204, name: 'Khalid Al-Ghamdi' },
        projectName: 'Facility',
        slaStatus: 'breached',
        commentsCount: 1,
        attachmentsCount: 0,
        dependencies: [
            { id: 1, name: 'Permit Required', remarks: 'checking', resolved: true }
        ],
        inventoryConsumed: [],
        dailyLogs: [],
        activities: [
            { id: 1, type: 'STATUS_CHANGED', from: 'Open', to: 'Suspended', user: 'Khalid Al-Ghamdi', timestamp: '2026-01-15T15:00:00Z' }
        ],
        chat: []
    },
    {
        id: 5,
        ticketId: '2568',
        title: 'camera is broken',
        type: 'TR',
        description: 'Replaced lens cover and adjusted focus.',
        status: 'closed',
        approvalStatus: 'approved',
        priority: 'medium',
        siteName: 'King abdulaziz street drive up',
        locationDetails: 'King abdulaziz street drive up',
        region: 'Riyadh',
        city: 'Riyadh',
        createdAt: '2025-11-20T08:00:00Z',
        updatedAt: subtractDays(10),
        completedDate: '2025-12-25T17:00:00Z',
        delayDays: 2,
        assignee: { id: 101, name: 'Ahmed Al-Sayed', role: 'Field Engineer' },
        reporter: { id: 201, name: 'Mohammed Ali' },
        projectName: 'Security Systems',
        slaStatus: 'met',
        commentsCount: 5,
        attachmentsCount: 3,
        attachments: [
            { id: 1, type: 'Status Closed', fileName: 'Ticketing-Logo.jpeg', uploadedDate: '2025-11-22T17:46:00Z', fileSize: 'JPEG' },
            { id: 2, type: 'Status Closed', fileName: 'Ticketing-Logo.jpeg', uploadedDate: '2025-12-19T18:51:00Z', fileSize: 'JPEG' },
            { id: 3, type: 'Status Closed', fileName: 'Ticketing-Logo.jpeg', uploadedDate: '2025-11-22T17:47:00Z', fileSize: 'JPEG' }
        ],
        inventoryConsumed: [
            {
                id: 1,
                name: 'AC-DC Power, -25degC, 60degC, 90V, 290V, 12V/29.2',
                barcode: '02131212',
                desc: '122025-01905',
                quantity: 1,
                consumedDate: '2026-01-24T00:00:00Z'
            },
            {
                id: 2,
                name: 'Router AR502H 2*RS485',
                barcode: '50010576',
                desc: '122025-01966',
                quantity: 1,
                consumedDate: '2026-01-25T00:00:00Z'
            }
        ],
        dailyLogs: [
            { id: 1, workDate: '2026-01-24T00:00:00Z', startTime: '09:00', endTime: '17:00', duration: '8 hrs', activity: 'TR', status: 'Closed', remoteVisit: false, distance: 'No', hotelStay: false }
        ],
        activities: [
            { id: 1, type: 'TICKET_CREATED', user: 'Administrator', timestamp: '2025-11-20T08:00:00Z' }
        ],
        dependencies: [
            { id: 1, name: 'AC Not Working', remarks: 'aaa', resolved: true },
            { id: 2, name: 'Permit Required', remarks: 'checking', resolved: true }
        ],
        chat: [
            { id: 1, sender: 'Manager', role: 'manager', text: 'Great work on closing this camera issue.', timestamp: '2025-12-25T17:05:00Z' }
        ]
    },
    {
        id: 6,
        ticketId: '2599',
        title: 'Pending parts',
        description: 'Waiting for spare fan component.',
        status: 'closed',
        approvalStatus: 'approved',
        priority: 'low',
        siteName: 'Hassani Building',
        locationDetails: 'Hassani Building',
        region: 'Riyadh',
        city: 'Riyadh',
        createdAt: subtractDays(12),
        updatedAt: subtractDays(5),
        completedDate: subtractDays(5),
        delayDays: 0,
        assignee: { id: 101, name: 'Ahmed Al-Sayed', role: 'Field Engineer' },
        reporter: { id: 206, name: 'Noura Al-Saud' },
        projectName: 'Maintenance',
        slaStatus: 'met',
        commentsCount: 0,
        attachmentsCount: 0,
        activities: [
            { id: 1, type: 'TICKET_CREATED', user: 'Noura Al-Saud', timestamp: subtractDays(12) }
        ],
        chat: []
    }
];

export const SLA_STATS = [
    { name: "Met", count: 45, color: "#10B981", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Breached", count: 5, color: "#EF4444", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Warning", count: 12, color: "#F97316", legendFontColor: "#7F7F7F", legendFontSize: 15 }
];

export const WEEKLY_PERFORMANCE = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [{ data: [5, 8, 4, 12, 9, 3, 2] }]
};

export const LOG_PICKLISTS = {
    activities: [
        { label: 'TR', value: 'TR' },
        { label: 'PM', value: 'PM' },
        { label: 'WF', value: 'WF' },
        { label: 'Other', value: 'Other' }
    ],
    sites: [
        { label: 'Main road drive up alhassa', value: 'site-1' },
        { label: 'Al Ashriea Gas Station', value: 'site-2' },
        { label: 'Alfawzan gas station', value: 'site-3' },
        { label: 'Petrol gas station 1', value: 'site-4' },
        { label: 'Hoshani Building', value: 'site-5' },
        { label: 'Hassani Building', value: 'site-6' }
    ],
    tickets: [
        { label: '2579', value: '2579' },
        { label: 'AMB-011', value: 'AMB-011' },
        { label: '2568', value: '2568' },
        { label: 'AMB-700', value: 'AMB-700' }
    ]
};

export const MOCK_LOGS: DailyLog[] = [
    {
        id: '1',
        workDate: '2026-01-04T00:00:00Z',
        ticketId: '2579',
        siteId: 'site-1',
        activityCode: 'TR',
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        remoteVisit: 'No',
        overtime: '',
        distance: '',
        remarks: '',
        hotelStay: 'No',
        approvalStatus: 'Approved By Supervisor',
        approvalRemarks: '',
        hasAttachment: false
    },
    {
        id: '2',
        workDate: '2025-12-24T00:00:00Z',
        ticketId: null,
        siteId: 'site-2',
        activityCode: 'Other',
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        remoteVisit: 'No',
        overtime: '',
        distance: '',
        remarks: '',
        hotelStay: 'No',
        approvalStatus: 'Approved By Supervisor',
        approvalRemarks: '',
        hasAttachment: false
    },
    {
        id: '3',
        workDate: '2025-12-22T00:00:00Z',
        ticketId: 'AMB-011',
        siteId: 'site-3',
        activityCode: 'PM',
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        remoteVisit: 'No',
        overtime: '',
        distance: '',
        remarks: '',
        hotelStay: 'No',
        approvalStatus: 'Approved By Supervisor',
        approvalRemarks: '',
        hasAttachment: false
    },
    {
        id: '4',
        workDate: '2025-12-22T00:00:00Z',
        ticketId: '2568',
        siteId: 'site-4',
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
        hasAttachment: false
    },
    {
        id: '5',
        workDate: '2025-12-21T00:00:00Z',
        ticketId: 'AMB-700',
        siteId: 'site-5',
        activityCode: 'WF',
        startTime: '10:00 AM',
        endTime: '02:00 PM',
        remoteVisit: 'Yes',
        overtime: '',
        distance: '',
        remarks: 'Network setup',
        hotelStay: 'No',
        approvalStatus: 'Approved By Administrator',
        approvalRemarks: 'Looks good',
        hasAttachment: true,
        attachmentName: 'network_report.pdf'
    }
];

export const MOCK_LOG_OVERVIEW: LogOverviewData = {
    totalActivities: 8,
    totalHours: '40h',
    totalDistance: '0 km',
    approvedOvertime: '0h',
    hotelNights: 0,
    btrEligibleDays: 0
};
