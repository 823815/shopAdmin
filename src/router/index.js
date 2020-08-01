import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/',
            redirect: '/login'
        }
    ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to and from are both route objects. must call `next`.
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})
export default router