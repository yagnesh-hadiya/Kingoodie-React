import axios from 'axios';

// Add a request interceptor 
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(async (config) => {
    return config;
}, (error) => {
    // Do something with request error 
    return Promise.reject(error);
});


axiosInstance.interceptors.response.use((response) => {
    // Do something with response data
    return response
}, function (error) {
    // Do something with response error
    return Promise.reject(error)
})


export default axiosInstance;