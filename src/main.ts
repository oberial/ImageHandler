import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
// import * as rou from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import 'element-plus/dist/index.css'
import globalTest from './plugin/global_two_func';
import singleSpaVue from 'single-spa-vue'


const app=createApp(App);

app.use(router)
app.use(ElementPlus)
app.use(globalTest);
app.mount('#app');

// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// // DON'T use "var indexedDB = ..." if you're not in a function.
// // Moreover, you may need references to some window.IDB* objects:
// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// console.log(app);
// 
// 受限的全局访问#
// 模板中的表达式将被沙盒化，仅能够访问到有限的全局对象列表
// import { makeMap } from './makeMap'

// const GLOBALS_WHITE_LISTED =
//   'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
//   'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
//   'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt'

// export const isGloballyWhitelisted = /*#__PURE__*/ makeMap(GLOBALS_WHITE_LISTED)


// if (!window.singleSpaNavigate) {
//     // delete vueOptions.el
//     app.mount('#app')
// }

// const vueLifecycles = singleSpaVue({
//     createApp,
//     appOptions: {
//         el: '#app',
//         render() {
//             return h(App, {
//                 props: {
//                     // single-spa props are available on the "this" object. Forward them to your component as needed.
//                     // https://single-spa.js.org/docs/building-applications#lifecyle-props
//                     name: this.name,
//                     mountParcel: this.mountParcel,
//                     singleSpa: this.singleSpa,
//                 },
//             });
//         },
//     },
//     handleInstance: (app) => {
//         app.use(router);
//         app.use(createPinia())
//     }
// });
// export const bootstrap = vueLifecycles.bootstrap;
// export const mount = vueLifecycles.mount;
// export const unmount = vueLifecycles.unmount;