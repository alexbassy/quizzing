import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/create', component: () => import('@/pages/List.vue') },
  { path: '/create/:id', component: () => import('@/pages/Create.vue') },
  { path: '/', component: () => import('@/pages/Play.vue') },
  { path: '/:questionIndex', component: () => import('@/pages/Play.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
