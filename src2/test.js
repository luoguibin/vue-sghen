var object = { a: 1, "b.a": 2, "b.b": 3, "cc.d.e": 4, "cc.d.f": 5 };

/**
 * 拆分键名中‘.’，格式化oject输出
 * @param {Object} object 
 */
function formatObject(object) {
    if (!object || typeof object !== "object") {
        return;
    }

    const outputOject = {};
    const keys = Object.keys(object);

    while (keys.length) {
        const key = keys.shift();
        // console.log("key=" + key)
        
        if (key.includes(".")) {
            const splitKeys = key.split(".");
            let currentObject = outputOject;

            for (let index = 0; index < splitKeys.length; index++) {
                // console.log(currentObject)
                const splitKey = splitKeys[index];
                if (index < splitKeys.length - 1) {
                    if (!currentObject[splitKey]) {
                        currentObject[splitKey] = {};
                        currentObject = currentObject[splitKey];
                        // console.log("new child object, splitKey=" + splitKey, outputOject)
                    } else if (typeof currentObject[splitKey] === "object") {
                        currentObject = currentObject[splitKey];
                        // console.log("assign child object, splitKey=" + splitKey, outputOject)
                    } else {
                        console.error("repeat splitKey=" + splitKey + " from key=" + key, outputOject);
                    }
                } else {
                    if (!currentObject[splitKey]) {
                        currentObject[splitKey] = object[key];
                        // console.log("new last child value, splitKey=" + splitKey, outputOject)
                    } else {
                        console.error("repeat splitKey=" + splitKey + " from key=" + key, outputOject);
                    }
                }
            }
        } else {
            outputOject[key] = object[key];
        }
        // console.log("\n");
    }

    return outputOject;
}

console.log(object, formatObject(object))