import API from './api'

export const authService = {
    login: (credential) => API.post('/auth/login', credential),
    register: (data) => API.post('/auth/register',data),
    logout: ()=>{
        localStorage.removeItem('token')
    }
}