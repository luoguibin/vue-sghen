export const JsLoader = function (path, call) {

    if (path instanceof Array) {
        const head = document.getElementsByTagName("HEAD")[0];
        if (!head) {
            return;
        }

        const paths = path, count = paths.length;
        let loadCount = 0;
        const currentNodes = Array.prototype.slice.call(head.children);
        paths.forEach(src => {
            if (currentNodes.includes(src)) {
                loadCount++;
                return;
            }
            let node;
            if (src.endsWith(".js")) {
                node = document.createElement("SCRIPT");
                node.src = src;
            } else if (src.endsWith(".css")) {
                node = document.createElement("LINK");
                node.href = src;
                node.rel = "stylesheet";
                node.type = "text/css";
            }

            if (node) {
                node.onload = e => {
                    const target = e.path[0];
                    target.onload = null;
                    loadCount++;
                    if (loadCount === count) {
                        call && call();
                    }
                }
                head.appendChild(node);
            }
        });

        if (loadCount === count) {
            console.log("already load");
            call && call();
        }
    } else {
        JsLoader([path], call);
    }
}