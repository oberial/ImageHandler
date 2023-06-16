import imagehelper from '../components/imagehelper.vue'
import uploadVue from '../views/uploadfather.vue';


import * as VueRouter from "vue-router";
// { RouterOptions }
const routes:any[] = [
  { path: '/image', component: imagehelper },
  { path: '/about', component: uploadVue },
] 

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
