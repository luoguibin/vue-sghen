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

const getTableData = (data, field = false) => {
    return request({
        url: '/v1/common/get',
        method: 'get',
        params: {
            type: 'table-data',
            data,
            field
        }
    })
}

const getSQLData = data => {
    return request({
        url: '/v1/common/get',
        method: 'get',
        params: {
            type: 'sql-data',
            data
        }
    })
}

export default {
    getApiData,
    getTables,
    getTableData,
    getSQLData
}