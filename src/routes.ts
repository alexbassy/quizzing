import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { name: 'QuizList', path: '/create', component: () => import('@/pages/QuizList.vue') },
  { name: 'QuizEditor', path: '/create/:id', component: () => import('@/pages/QuizEditor.vue') },
  { name: 'PlayBegin', path: '/play/:roundId/', component: () => import('@/pages/PlayBegin.vue') },
  {
    name: 'PlayQuestion',
    path: '/play/:roundId/:questionId',
    component: () => import('@/pages/PlayQuestion.vue'),
  },
  { name: 'NotFound', path: '/404', component: () => import('@/pages/NotFound.vue') },
  { name: 'Index', path: '/', redirect: '/create' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
