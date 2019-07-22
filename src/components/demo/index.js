export const getDemoComponent = function (name) {
    return import(/* webpackChunkName: "[request]" */"./" + name);
}