export default function (name) {
    return import(/* webpackChunkName: "[request]" */"./" + name);
}