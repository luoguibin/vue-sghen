class Http {

    getData(url, call) {
        axios.get(url).then(call).catch(this.catchErr);
    }

    post(url, data, call) {
        axios.post(url, data).then(call).catch(this.catchErr);
    }

    catchErr(e) {
        console.log("Http catchErr", e);
    }
}

export default new Http();