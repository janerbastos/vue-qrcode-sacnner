import axios from 'axios'

const token = localStorage.getItem('access_token')
const axiosInstance = axios.create({
    baseURL: '',
    headers: {
        Authorization : `Bearer ${token}`,
        'x-api-key': 'hYUPGBZh9xLrCwOKWRtbN461Zbj47oaE'
    }
})

export default {
    install: (app, options) => {
        app.provide('axios', axiosInstance)
    }
}
