import { createRouter, createWebHistory } from 'vue-router'

export enum Routes {
  Home = 'Home',
  Creator = 'Creator',
  PrePresent = 'PrePresent',
  Present = 'Present',
  Scores = 'Scores',
  NotFound = 'NotFound',
  Index = 'Index',
}

const routes = [
  {
    name: Routes.Index,
    path: '/',
    redirect: '/create',
  },
  {
    name: Routes.Home,
    path: '/create',
    component: () => import('@/pages/Home.vue'),
  },
  {
    name: Routes.Creator,
    path: '/create/:id',
    component: () => import('@/pages/Creator.vue'),
  },
  {
    name: Routes.Scores,
    path: '/play/:roundId/scores',
    component: () => import('@/pages/Scores.vue'),
  },
  {
    name: Routes.PrePresent,
    path: '/play/:roundId/',
    component: () => import('@/pages/PrePresent.vue'),
  },
  {
    name: Routes.Present,
    path: '/play/:roundId/:questionId',
    component: () => import('@/pages/Present.vue'),
  },
  {
    name: Routes.NotFound,
    path: '/404',
    component: () => import('@/pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
