import api from './api';

export const dashboardService = {
    getTeacherStats: async () => {
        const response = await api.get('/dashboard/teacher-stats');
        return response.data;
    }
};