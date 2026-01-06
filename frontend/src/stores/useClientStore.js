import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "sonner";

export const useClientStore = create((set, get) => ({
    clients: [],
    isLoading: false,

    fetchClients: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.get('/clients');
            set({ clients: data.clients });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch clients');
        } finally {
            set({ isLoading: false });
        }
    },

    createClient: async (clientData) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.post('/clients', clientData);
            set(state => ({ clients: [...state.clients, data.client] }));
            toast.success(data.message || 'Client created successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create client');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    updateClient: async (clientId, clientData) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.put(`/clients/${clientId}`, clientData);
            set(state => ({
                clients: state.clients.map(c => c._id === clientId ? data.client : c)
            }));
            toast.success(data.message || 'Client updated successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update client');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));
