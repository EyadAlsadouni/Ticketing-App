// features/inventory/types.ts

export type InventoryRequestStatus = 'Accept' | 'Released' | 'Out of Stock' | 'Pending' | 'Rejected' | 'Return';
export type ReleaseStatus = 'Released' | 'Accept' | 'Pending' | 'Returned';

export interface RequestedItem {
    id: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    issued: number;
    status: InventoryRequestStatus;
    remarks: string;
}

export interface InventoryRequest {
    id: string;
    requestNumber: string; // REQ-2025...
    requestedTo: string;
    requestedBy: string;
    requestedOn: string;
    items: RequestedItem[];
    status: InventoryRequestStatus;
    approvedAt?: string;
    remarks?: string;
}

export interface InventoryReleaseItem {
    id: string;
    requestNumber: string;
    itemCode: string;
    itemName: string;
    model: string;
    vendor: string;
    category: string;
    subCategory: string;
    barcode: string;
    issued: number;
    remarks: string;
    status: ReleaseStatus;
}

export interface InventoryReturn {
    id: string;
    returnNumber: string;
    requestedBy: string;
    requestedTo: string;
    status: 'Return' | 'Pending' | 'Completed';
    created: string;
    itemCount: number;
    remarks: string;
    items: RequestedItem[];
}

export interface InventoryCatalogItem {
    id: string;
    code: string;
    name: string;
    model: string;
    vendor: string;
    available: number;
}

export interface InventoryState {
    requests: InventoryRequest[];
    catalog: InventoryCatalogItem[];
    receivedItems: InventoryReleaseItem[];
    returns: InventoryReturn[];
    isLoading: boolean;

    // Actions
    fetchRequests: () => Promise<void>;
    addRequest: (request: Omit<InventoryRequest, 'id' | 'requestNumber' | 'requestedOn' | 'status'>) => Promise<void>;
    deleteRequest: (id: string) => Promise<void>;

    fetchReceived: () => Promise<void>;
    acceptItem: (id: string) => Promise<void>;
    applyItem: (id: string, data: any) => Promise<void>;
    returnItem: (id: string, data: any) => Promise<void>;

    fetchReturns: () => Promise<void>;
}
