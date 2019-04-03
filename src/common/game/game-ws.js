import OrderCenter from "./order-center";

class GameWS {

    ws = null;
    url = "ws://127.0.0.1:8088/ws";

    connect(token) {
        const flag = "WebSocket" in window;
        if (!flag) {
            alert("当前浏览器不支持WebSocket");
            return;
        }

        const ws = new WebSocket(this.url + "?token=" + token);
        if (!ws) {
            console.log("ws create error");
            return;
        }

        ws.onopen = () => {
            console.log("connectServer() ws onopen");
            this.ws = ws;
        };

        ws.onmessage = e => {
            OrderCenter.dealOrder(JSON.parse(e.data));
        };

        ws.onerror = (e) => {
            console.log("ws error", e);
            if (!this.ws) {
                alert("connect error")
            }
        };

        ws.onclose = (e) => {
            console.log("ws close", e);
            this.ws = null;
        };

    }

    sendOrder(order) {
        this.ws.send(JSON.stringify(order));
    }

    release() {
        this.ws && this.ws.close();
    }
}

export default new GameWS();