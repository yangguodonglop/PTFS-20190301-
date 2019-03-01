import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import nodes from './views/nav1/nodes.vue'
import kakfa from './views/nav1/kakfa.vue'
import files from './views/nav1/files.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import index from './views/nav1/index.vue'
import miningmachine from './views/nav1/miningmachine.vue'
import income from './views/nav1/income.vue'
import logs from './views/nav1/logs.vue'








let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '导航',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/', component: index, name: 'PTFS网络概览', },
            // { path: '/index', component: index, name: 'PTFS网络概览',},
            { path: '/nodes', component: nodes, name: 'PTFS节点管理' },
           
            { path: '/files', component: files, name: 'PTFS文件管理' },
            { path: '/kakfa', component: kakfa, name: '消息队列/Kakfa管理' },
            // { path: '/Page5', component: Page5, name: '消息队列/Kakfa管理' },
            { path: '/miningmachine', component: miningmachine, name: '矿机管理' },
            { path: '/income', component: income, name: '矿机收益管理' },
            { path: '/logs', component: logs, name: '日志查看' },
           
            
            
            
            
            
            

          
        ]
    },
    
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;