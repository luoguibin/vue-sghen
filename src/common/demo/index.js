const requireComponent = require.context(
    "../../components/demo/",
    false,
    /\.vue$/
);

const componentMap = {};
requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName);
    const componentName = fileName.replace(/^\.\//, "").replace(/\.\w+$/, "");
    componentMap[componentName] = false;
});

export default componentMap;