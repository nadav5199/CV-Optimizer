import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    }
})

export const applicationService = {
    submit: (formData: FormData) => api.post('/apply', formData),
    getAll: () => api.get('/view')
};

export default api