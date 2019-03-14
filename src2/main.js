const xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText)
    }
}
xmlHttp.open("GET", "./static/js/shared-worker-test.min.js", true);
xmlHttp.send();