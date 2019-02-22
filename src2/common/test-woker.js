const input = document.createElement("INPUT");
document.body.appendChild(input);

const button = document.createElement("BUTTON");
button.innerHTML = "send"
button.onclick = function () {
    console.log(port, input.value)
    port.postMessage(input.value);
}
document.body.appendChild(button);

const div = document.createElement("DIV");
document.body.appendChild(div);

const worker = new SharedWorker("./static/js/shared-worker-test.min.js", "shared-woker-test");
const port = worker.port;
port.start();

port.onmessage = function (e) {
    if (typeof e.data === "object") {
        console.log("onmessage() count=" + e.data.count);
    } else {
        div.innerHTML = e.data;
    }
}

export {}