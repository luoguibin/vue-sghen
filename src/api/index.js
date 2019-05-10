import request from "./axios";

export const loginByAccount = account =>
    request({
        url: "/v1/user/login",
        method: "post",
        data: account
    });


export const queryPeotries = params =>
    request({
        url: "/v1/peotry/query",
        method: "get",
        params
    })

export const queryPeotrySets = uId =>
    request({
        url: "/v1/peotry-set/query",
        method: "get",
        params: {
            token: true,
            uId
        }
    })


export const createPeotry = peotry => 
    request({
        url: "/v1/peotry/create",
        method: "post",
        params: {
            token: true
        },
        data: peotry,
    })

export const updatePeotry = peotry => 
    request({
        url: "/v1/peotry/update",
        method: "post",
        params: {
            token: true
        },
        data: peotry,
    })

export const deletePeotry = pId => 
    request({
        url: "/v1/peotry/delete",
        method: "delete",
        params: {
            token: true,
            pId
        }
    })

export const createComment = data =>
    request({
        url: "/v1/comment/create",
        method: "post",
        data
    })