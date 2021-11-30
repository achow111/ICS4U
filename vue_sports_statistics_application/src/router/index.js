import { createRouter, createWebHistory } from 'vue-router'
import Standings from '../views/Standings.vue'

const routes = [
  {
    path: '/standings',
    name: 'Standings',
    props: true,
    component: Standings
  },
  {
    path: '/scores',
    name: 'Scores',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Scores.vue')
  },
  {
    path: '/submit_scores',
    name: 'Submit-Score',
    props: true,
    component: () => import(/* webpackChunkName: "about" */ '../views/Submit-Score.vue')
  },
  { 
    path: "/" ,
    redirect: '/standings' 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
