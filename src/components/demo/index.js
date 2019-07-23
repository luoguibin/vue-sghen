export const getDemoComponent = function (name) {
    return import(/* webpackChunkName: "[request]" */"./" + name);
}

const requireComponent = require.context(
    "./",
    false,
    /\.vue$/
);

const componentMap = {};
requireComponent.keys().forEach(fileName => {
    // const componentConfig = requireComponent(fileName);
    const componentName = fileName.replace(/^\.\//, "").replace(/\.\w+$/, "");
    componentMap[componentName] = false;
});

export default componentMap;