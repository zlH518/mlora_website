import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import TeamPage from '../views/TeamPage.vue'
import IDSLabPage from '../views/IDSLabPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage,
  },
  {
    path: '/team',
    name: 'Team',
    component: TeamPage,
  },
  {
    path: '/ids-lab',
    name: 'IDSLab',
    component: IDSLabPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
