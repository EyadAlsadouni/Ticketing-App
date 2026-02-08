// features/inventory/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InventoryState, InventoryRequest, InventoryCatalogItem } from './types';
import { MOCK_INVENTORY_REQUESTS, MOCK_INVENTORY_CATALOG } from '../../mock/data';

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set, get) => ({
            requests: [],
            catalog: [],
            receivedItems: [],
            returns: [],
            isLoading: false,

            fetchRequests: async () => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 500));

                const currentRequests = get().requests;
                const currentCatalog = get().catalog;

                set({
                    requests: currentRequests.length > 0 ? currentRequests : MOCK_INVENTORY_REQUESTS as InventoryRequest[],
                    catalog: currentCatalog.length > 0 ? currentCatalog : MOCK_INVENTORY_CATALOG as InventoryCatalogItem[],
                    isLoading: false
                });
            },

            addRequest: async (newRequestData) => {
                set({ isLoading: true });
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                const requestNumber = `REQ-${now.getTime()}-36`;

                const newRequest: InventoryRequest = {
                    id: Math.random().toString(36).substr(2, 9),
                    requestNumber,
                    requestedOn: dateStr,
                    status: 'Pending',
                    ...newRequestData,
                };

                set((state) => ({
                    requests: [newRequest, ...state.requests],
                    isLoading: false,
                }));
            },

            deleteRequest: async (id) => {
                set((state) => ({
                    requests: state.requests.filter((r) => r.id !== id),
                }));
            },

            fetchReceived: async () => {
                set({ isLoading: true });
                await new Promise((resolve) => setTimeout(resolve, 500));

                const currentReceived = get().receivedItems;
                const { MOCK_INVENTORY_RELEASE } = require('../../mock/data');

                set({
                    receivedItems: currentReceived.length > 0 ? currentReceived : MOCK_INVENTORY_RELEASE,
                    isLoading: false
                });
            },

            acceptItem: async (id) => {
                set((state) => ({
                    receivedItems: state.receivedItems.map((item) =>
                        item.id === id ? { ...item, status: 'Accept' } : item
                    )
                }));
            },

            applyItem: async (id, data) => {
                // Logic: Remove item from received and "apply" elsewhere
                set((state) => ({
                    receivedItems: state.receivedItems.filter((item) => item.id !== id)
                }));
            },

            returnItem: async (id, data) => {
                set((state) => ({
                    receivedItems: state.receivedItems.map((item) =>
                        item.id === id ? { ...item, status: 'Pending' } : item
                    )
                }));
            },

            fetchReturns: async () => {
                set({ isLoading: true });
                await new Promise((resolve) => setTimeout(resolve, 500));

                const { MOCK_INVENTORY_RETURNS } = require('../../mock/data');

                // Force refresh to clear any stale persisted data with 'fieldengineer' as recipient
                set({
                    returns: MOCK_INVENTORY_RETURNS,
                    isLoading: false
                });
            },
        }),
        {
            name: 'inventory-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
