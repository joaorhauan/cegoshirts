import axios from 'axios'
import { getToken } from './storage'


const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.14:3001/api',
})

api.interceptors.request.use(async (config) => {
    const token = await getToken()

    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})
    
export default api