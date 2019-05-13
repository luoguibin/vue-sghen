import request from "./axios";
import CryptoJS from 'crypto-js';

const baseHmacMd5 = (data, key) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacMD5(data, key));
}
const privateKey = CryptoJS.enc.Utf8.parse("sghenmorge");

export const loginByAccount = ({ uId, pw }) =>
    request({
        url: "/v1/user/login",
        method: "post",
        data: {
            uId,
            pw: baseHmacMd5(pw, privateKey)
        }
    });

export const updateUser = data =>
    request({
        url: "/v1/user/update",
        method: "post",
        params: {
            token: true
        },
        data
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
        params: {
            token: true
        },
        data
    })