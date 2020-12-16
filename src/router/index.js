import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
// import Home from '../components/home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
// import Welcome from '../components/welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')


// import Users from '../components/Users/users.vue'
const Users = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/Users/users.vue')
// import Roles from '../components/Power/roles.vue'
const Roles = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/Power/roles.vue')
// import Rights from '../components/Power/rights.vue'
const Rights = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/Power/rights.vue')

// import Categories from '../components/Goods/categories.vue'
const Categories = () => import(/* webpackChunkName: "cate_params" */ '../components/Goods/categories.vue')
// import Params from '../components/Goods/params.vue'
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/Goods/params.vue')

// import Goods from '../components/Goods/goods.vue'
const Goods = () => import(/* webpackChunkName: "goods_add" */ '../components/Goods/goods.vue')
// import Add from '../components/Goods/add.vue'
const Add = () => import(/* webpackChunkName: "goods_add" */ '../components/Goods/add.vue')
// import Order from '../components/Order/order.vue'
const Order = () => import(/* webpackChunkName: "orders_reports" */ '../components/Order/order.vue')
// import Reports from '../components/Reports/reports.vue'
const Reports = () => import(/* webpackChunkName: "orders_reports" */ '../components/Reports/reports.vue')

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/login',
            component: Login,
        },
        {
            path: '/home',
            component: Home,
            redirect:'/welcome',
            children:[
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path:'/roles',
                component:Roles
            },
            {
                path:'/rights',
                component:Rights
            },
            {
                path:'/categories',
                component:Categories
            },
            {
                path:'/params',
                component:Params
            },
            {
                path:'/goods',
                component:Goods,                  
            },
            {
                path:'/goods/add',
                component:Add
            },
            {
                path:'/orders',
                component:Order
            },
            {
                path:'/reports',
                component:Reports
            },
            ]  
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
// 解决     Avoided redundant navigation to current location  问题报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
export default router