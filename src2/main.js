const _obj = {
    id: 123456789,
    name: "123"
}

const obj = {
    id: 123456789,
    name: "123"
}

Object.defineProperties(obj, {
    id: {
        get: function() {
            console.log("obj get id")
            return _obj.id
        },
        set: function(v) {
            console.log("obj set id=" + v)
            _obj.id = v;
        }
    }
})

window.obj = obj;