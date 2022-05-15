import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/Play.vue') },
  { path: '/:questionIndex', component: () => import('@/pages/Play.vue') },
  { path: '/create', component: () => import('@/pages/Create.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
