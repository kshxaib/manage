import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "sonner";

export const useProjectStore = create((set, get) => ({
    projects: [],
    isLoading: false,

    fetchAllProjects: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.get('/projects/admin');
            set({ projects: data.projects });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch projects');
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMyProjects: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.get('/projects/my');
            set({ projects: data.projects });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch projects');
        } finally {
            set({ isLoading: false });
        }
    },

    createProject: async (projectData) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.post('/projects', projectData);
            set(state => ({ projects: [...state.projects, data.project] }));
            toast.success(data.message || 'Project created successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create project');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    toggleProjectLock: async (projectId) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.patch(`/projects/${projectId}/toggle-lock`);
            set(state => ({
                projects: state.projects.map(p => p._id === projectId ? { ...p, isLocked: data.isLocked } : p)
            }));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to toggle lock');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    updateProjectInfo: async (projectId, updateData) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.patch(`/projects/${projectId}`, updateData);
            set(state => ({
                projects: state.projects.map(p => p._id === projectId ? data.project : p)
            }));
            toast.success(data.message || 'Project updated');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update project');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    addDeveloperToProject: async (projectId, devData) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.post(`/projects/${projectId}/developers`, devData);
            set(state => ({
                projects: state.projects.map(p => p._id === projectId ? data.project : p)
            }));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to assign developer');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    removeDeveloperFromProject: async (projectId, developerId) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.delete(`/projects/${projectId}/developers/${developerId}`);
            set(state => ({
                projects: state.projects.map(p => p._id === projectId ? data.project : p)
            }));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove developer');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    addDocument: async (projectId, docData) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.post(`/projects/${projectId}/documents`, docData);
            set(state => ({
                projects: state.projects.map(p => p._id === projectId ? { ...p, documents: data.documents } : p)
            }));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add document');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    updateInfrastructure: async (projectId, infraData) => {
        set({ isLoading: true });
        try {
            // This handles both deploymentLinks (if provided) and hosting info
            if (infraData.deploymentLinks) {
                await axiosInstance.patch(`/projects/${projectId}/deployment-links`, { deploymentLinks: infraData.deploymentLinks });
            }
            if (infraData.hosting) {
                await axiosInstance.patch(`/projects/${projectId}/hosting`, infraData.hosting);
            }

            // Refetch to get updated state (simpler than manual merging of deep objects)
            const { data } = await axiosInstance.get(`/projects/admin/${projectId}`);
            set(state => ({
                projects: state.projects.map(p => p._id === projectId ? data.project : p)
            }));

            toast.success('Infrastructure updated successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update infrastructure');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    recordPayment: async (projectId, amountPaid) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.patch(`/projects/${projectId}/payment`, { amountPaid });
            set(state => ({
                projects: state.projects.map(p => p._id === projectId ? data.project : p)
            }));
            toast.success(data.message || 'Payment recorded');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to record payment');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    updateClosureNotes: async (projectId, closureNotes) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.patch(`/projects/${projectId}/closure-notes`, { closureNotes });
            set(state => ({
                projects: state.projects.map(p => p._id === projectId ? data.project : p)
            }));
            toast.success(data.message || 'Closure notes updated');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update closure notes');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));
