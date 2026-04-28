import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    }
})

export const applicationService = {
    submit: (formData: FormData) => api.post('/apply', formData),
    getAll: () => api.get('/view'),
    getOne: (id: string) => api.get(`/view/${id}`),
    delete: (id: string) => api.delete(`/view/${id}/delete`),
};

export default api