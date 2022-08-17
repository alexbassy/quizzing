import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { name: 'Create', path: '/create', component: () => import('@/pages/List.vue') },
  { name: 'CreateQuestion', path: '/create/:id', component: () => import('@/pages/Create.vue') },
  { name: 'Play', path: '/play/:roundId/', component: () => import('@/pages/PlayBegin.vue') },
  {
    name: 'PlayQuestion',
    path: '/play/:roundId/:questionId',
    component: () => import('@/pages/Play.vue'),
  },
  { name: 'NotFound', path: '/404', component: () => import('@/pages/NotFound.vue') },
  { name: 'Index', path: '/', redirect: '/create' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
