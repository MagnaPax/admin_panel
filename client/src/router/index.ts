import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BrandView from '../views/BrandView.vue'
import CategoryView from '@/views/CategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/brand',
      name: 'brand',
      component: BrandView
    },
    {
      path: '/category',
      name: 'category',
      component: CategoryView
    },
    {
      path: '/product',
      name: 'product',
      // lazy-loaded when the route is visited.
      component: () => import('../views/ProductView.vue')
    }
  ]
})

export default router
