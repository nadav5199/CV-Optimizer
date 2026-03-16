import axios from 'axios'
import type { ApplicationData } from '../types/application.types'

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    }
})

export const applicationService = {
    submit: (formData: ApplicationData) => api.post('/apply', formData)
};

export default api