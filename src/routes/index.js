import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);
export const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('../page/LoginPage')
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../page/SignUp')
        },
        {
            path: '/chat',
            name: 'chat',
            component: () => import('../page/ChatBox')
        },

    ],
    mode: "history"
})