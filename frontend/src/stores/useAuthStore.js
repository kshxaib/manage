import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
    user: null,
    isLoggingIn: false,
    isCheckingUser: true,

    checkAuth: async () => {
        set({ isCheckingUser: true });
        try {
            const { data } = await axiosInstance.get('/auth/me');
            set({ user: data.user });
        } catch (error) {
            set({ user: null });
        } finally {
            set({ isCheckingUser: false });
        }
    },

    login: async (email, password) => {
        set({ isLoggingIn: true })
        try {
            const { data } = await axiosInstance.post('/auth/login', { email, password })
            set({ user: data.user })
            toast.success(data.message || 'Login successful')
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
            return false;
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({ user: null })
            toast.success('Logged out successfully')
            window.location.href = '/';
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed')
        }
    },
}))
