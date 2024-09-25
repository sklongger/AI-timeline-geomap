import axios from 'axios'
import config from '@/../config/config.ts'

const request = axios.create({
    baseURL: `${config.baseUrl}/autumnRiver`,
    timeout: 30000
})

const errorHandler = error => {
    //TODO: 错误处理
}

request.interceptors.request.use(config => {
    return config
}, errorHandler)

request.interceptors.response.use(response => {
    return Promise.resolve(response.data)
}, errorHandler)

export default request
