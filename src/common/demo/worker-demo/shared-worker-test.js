// shared-worker test
// maybe use heart-beat to check the port if alive.
// cmd: uglifyjs shared-worker-test.js -o shared-worker-test.min.js

var workers = [];

self.addEventListener("connect", function (e) {
    var port = e.ports[0];
    port.start();
    workers.push(port);
    postMessageForAll({ count: workers.length, sum: e.ports.length });

    port.addEventListener("message", function (e) {
        if (e.data === "quit") {
            disconnect(e.target);
        }
        postMessageForAll(e.data);
    });
});

function postMessageForAll(data) {
    for (var i = 0; i < workers.length; i++) {
        workers[i].postMessage(data);
    }
}

function disconnect(worker) {
    var index = workers.indexOf(worker);
    workers.splice(index, 1);

    if (workers.length === 0) {
        self.stop();
    }
}