import request from "axios"
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://sapi.sghen.cn' : 'http://localhost:8085'
request.defaults.baseURL = baseUrl
request.defaults.timeout = 10000


const getApiData = () => {
    return request({
        url: '/v1/common/get',
        method: 'get',
        params: {
            type: 'api'
        }
    })
}

const getTables = () => {
    return request({
        url: '/v1/common/get',
        method: 'get',
        params: {
            type: 'table'
        }
    })
}

const getTableData = (tableName, field = false) => {
    return request({
        url: '/v1/common/get',
        method: 'get',
        params: {
            type: 'table-data',
            tableName,
            field
        }
    })
}

export default {
    getApiData,
    getTables,
    getTableData
}