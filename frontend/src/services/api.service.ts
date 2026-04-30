import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/',
})

export const applicationService = {
    submit: (formData: FormData) => api.post('/apply', formData),
    getAll: () => api.get('/view'),
    getOne: (id: string) => api.get(`/view/${id}`),
    delete: (id: string) => api.delete(`/view/${id}/delete`),
};

export const mainCvService = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('cv', file);
        return api.post('/main-cv', formData);
    },
    get: () => api.get('/main-cv'),
};

export default api
