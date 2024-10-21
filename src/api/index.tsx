import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://texnoark.ilyosbekdev.uz"
})
 axiosInstance.interceptors.request.use((config: any): any => {
    const access_token = localStorage.getItem("access_token")
    if(access_token){
        config.headers["Authorization"] = `Bearer ${access_token}`
    }
    return config
 })
 export default axiosInstance