import api from './api';

export const documentService = {
    // Get all documents for the teacher
    getAll: async () => {
        const response = await api.get('/documents');
        return response.data;
    },

    // Upload a new document
    upload: async (formData: FormData) => {
        const response = await api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete a document
    delete: async (id: number) => {
        return await api.delete(`/documents/${id}`);
    }
};