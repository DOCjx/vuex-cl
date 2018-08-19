import Vue from 'vue';
import Root from './index';
import {store as connectStore} from './connect/';
const store = new connectStore(); // 使用时可以根据需要在合适的地方加入

new Vue({
    el: '#root',
    store,
    render: h => h(Root)
});