import api from './api';

export const questionService = {
    // Get all questions for a specific course (Bank)
    getQuestionsByCourse: async (courseId: number | string) => {
        const response = await api.get(`/questions/course/${courseId}`);
        return response.data;
    },

    // Create a new question
    createQuestion: async (data: FormData) => {
        const response = await api.post('/questions', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete a question
    deleteQuestion: async (id: number) => {
        return await api.delete(`/questions/${id}`);
    }
};