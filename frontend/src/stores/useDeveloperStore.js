import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "sonner";

export const useDeveloperStore = create((set, get) => ({
    developers: [],
    isLoading: false,

    fetchDevelopers: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.get('/auth/users');
            set({ developers: data.users });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch developers');
        } finally {
            set({ isLoading: false });
        }
    },

    createDeveloper: async (developerData) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.post('/auth/register', developerData);
            set(state => ({ developers: [data.user, ...state.developers] }));
            toast.success(data.message || 'Developer created successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create developer');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    toggleDeveloperStatus: async (userId) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.put(`/auth/toggle-status/${userId}`);
            set(state => ({
                developers: state.developers.map(d =>
                    d._id === userId ? { ...d, isActive: data.isActive } : d
                )
            }));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));
