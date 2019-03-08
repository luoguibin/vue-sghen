const getDynaComp = function (name) {
    return import('./' + name + ".vue");
}

export default getDynaComp;