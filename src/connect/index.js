import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

let vuexStore = {};
let componentsModules = {};
const connectComponents = [];
const getObjType = obj => Object.prototype.toString.call(obj).slice(8, -1);
const fixPre = (componentName, fn) => (...arg) => {
    const [fistArg, ...rest] = arg;
    let type = '';
    if (getObjType(fistArg) === 'String') {
        type = ~fistArg.indexOf('/') ? fistArg : `${componentName}/${fistArg}`;
        return fn(type, ...rest);
    }
    else {
        type = ~fistArg.type.indexOf('/') ? fistArg.type : `${componentName}/${fistArg.type}`;
        return fn({
            ...fistArg,
            type
        });
    }
};
const combineStore = components => {
    for (let {component, module} of components) {
        const {name: componentName, props, created} = component;
        for (let methodKey of Object.keys(component.methods || {})) {
            const method = component.methods[methodKey];
            const {dispatch, commit, state} = vuexStore;
            component.methods[methodKey] = function (payload) {
                return method.call(this, {
                    dispatch: fixPre(componentName, dispatch),
                    commit: fixPre(componentName, commit),
                    state: state[componentName]
                }, payload);
            };
        }
        component.computed = {
            ...Vuex.mapState((() => {
                const states = componentsModules[componentName]
                    && componentsModules[componentName].state;
                const combineState = {};
                for (let state of Object.keys(states || {})) {
                    combineState[state] = () => vuexStore.state[componentName][state];
                }
                return combineState;
            })()),
            ...(component.computed || {})
        };
        component.created = function () {
            const componentStoreModule = vuexStore.state[componentName];
            if (!componentStoreModule.state) {
                vuexStore.state[componentName].state = {};
            }
            for (let prop of (props || [])) {
                if (!!componentStoreModule.state[prop]) {
                    if (getObjType(componentStoreModule.state[prop]) !== 'Array') {
                        throw new Error(`state中存在与props同名的属性${prop}，自动合并失败`);
                    }
                    else {
                        componentStoreModule.state[prop].push(this[prop]);
                    }
                }
                else {
                    componentStoreModule.state[prop] = [
                        this[prop]
                    ];
                }
            }
            getObjType(created) === 'Function' && created.call(this);
        };
    }
};

export const connect = component => module => {
    connectComponents.push({
        component,
        module
    });
    if (!component.name) {
        console.error('请把组件的name补上');
        return;
    }
    componentsModules[component.name] = module;
    return component;
};

export const store = () => {
    const modules = componentsModules;
    const combineAction = {};
    for (let key of Object.keys(modules || {})) {
        combineAction[key] = {
            ...modules[key],
            mutations: (() => {
                const preMutations = {};
                for (let mutation of Object.keys(modules[key].mutations || {})) {
                    preMutations[`${key}/${mutation}`] = modules[key].mutations[mutation];
                }
                return preMutations;
            })(),
            actions: (() => {
                let component = connectComponents.filter(({component}) => component.name === key);
                let componentMethods2Action = {};
                component = (component[0] && component[0].component) || {};
                for (let method of Object.keys(component.methods || {})) {
                    componentMethods2Action[`${key}/${method}`] = function (actionStore, payload) {
                        return component.methods[method](payload);
                    };
                }
                return componentMethods2Action;
            })()
        };
    }
    vuexStore = new Vuex.Store({
        strict: true,
        modules: combineAction
    });
    combineStore(connectComponents);
    return vuexStore;
};
