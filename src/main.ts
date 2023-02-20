import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import globalTest from './plugin/global_two_func';


const app=createApp(App);
app.use(ElementPlus)
app.use(globalTest);
app.mount('#app');

console.log(app);
// 
// 受限的全局访问#
// 模板中的表达式将被沙盒化，仅能够访问到有限的全局对象列表
// import { makeMap } from './makeMap'

// const GLOBALS_WHITE_LISTED =
//   'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
//   'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
//   'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt'

// export const isGloballyWhitelisted = /*#__PURE__*/ makeMap(GLOBALS_WHITE_LISTED)


