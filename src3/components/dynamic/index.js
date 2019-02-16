const getDynamicComponent = function (name) {
    return import('./' + name + ".vue");
}

export default getDynamicComponent;