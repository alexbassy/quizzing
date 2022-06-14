import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/create', component: () => import('@/pages/List.vue') },
  { path: '/create/:id', component: () => import('@/pages/Create.vue') },
  { path: '/play/:id/', component: () => import('@/pages/Play.vue') },
  { path: '/play/:id/:questionId', component: () => import('@/pages/Play.vue') },
  { path: '/', redirect: '/create' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
