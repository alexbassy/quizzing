import { createRouter, createWebHistory } from 'vue-router'

export enum Routes {
  List = 'QuizList',
  Editor = 'QuizEditor',
  BeginQuiz = 'PlayBegin',
  PlayQuestion = 'PlayQuestion',
  Scores = 'Scores',
  NotFound = 'NotFound',
  Index = 'Index',
}

const routes = [
  {
    name: Routes.List,
    path: '/create',
    component: () => import('@/pages/QuizList.vue'),
  },
  {
    name: Routes.Editor,
    path: '/create/:id',
    component: () => import('@/pages/QuizEditor.vue'),
  },
  {
    name: Routes.BeginQuiz,
    path: '/play/:roundId/',
    component: () => import('@/pages/PlayBegin.vue'),
  },
  {
    name: Routes.Scores,
    path: '/play/:roundId/scores',
    component: () => import('@/pages/QuizScores.vue'),
  },
  {
    name: Routes.PlayQuestion,
    path: '/play/:roundId/:questionId',
    component: () => import('@/pages/PlayQuestion.vue'),
  },
  {
    name: Routes.NotFound,
    path: '/404',
    component: () => import('@/pages/NotFound.vue'),
  },
  {
    name: Routes.Index,
    path: '/',
    redirect: '/create',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
