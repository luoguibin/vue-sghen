// shared-worker test
// cmd: uglifyjs main.js -o shared-worker-test.js

var workers = [];

self.addEventListener("connect", function (e) {
    var port = e.ports[0];
    port.start();
    workers.push(port);
    port.postMessage({ count: workers.length });

    port.addEventListener("message", function (e) {
        for (var i = 0; i < workers.length; i++) {
            workers[i].postMessage(e.data + " from shared-worker-test");
        }
    });
});