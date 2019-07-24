var fs = require("fs")
var join = require('path').join;

function getJsonFiles(jsonPath) {
    let jsonFiles = [];
    function findJsonFile(path) {
        let files = fs.readdirSync(path);
        files.forEach(function (item, index) {
            let fPath = join(path, item);
            let stat = fs.statSync(fPath);
            if (stat.isDirectory() === true) {
                findJsonFile(fPath);
            }
            if (stat.isFile() === true) {
                jsonFiles.push(fPath);
            }
        });
    }
    findJsonFile(jsonPath);
    return jsonFiles;
}


const componentMap = {};
getJsonFiles("./src/components/demo/").forEach(fileName => {
    const i = fileName.lastIndexOf("\\");
    const tempName = fileName.slice(i + 1);
    if (tempName.indexOf(".vue")) {
        componentMap[tempName.replace(".vue", "")] = false;
    }
});


fs.writeFile('./src/assets/config/demo-comps.json', JSON.stringify(componentMap), function (error) {
    if (error) {
        console.log('写入失败')
    } else {
        console.log('写入成功了')
    }
})
