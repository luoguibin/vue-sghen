const getDynaComp = function (name) {
    return import(/* webpackChunkName: "[request]" */'./' + name);
}

export default getDynaComp;