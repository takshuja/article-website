import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import SignupView from '@/views/auth/SignupView.vue'
import ProfileView from '@/views/user/ProfileView.vue'
import { authStore } from '@/stores/authStore'
import UploadArticleView from '@/views/upload/UploadArticleView.vue'
import { useRouteStore } from '@/stores/routeStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },

  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadArticleView,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, _, next) => {

  const authenticationStore = authStore();
  const routeStore = useRouteStore();
  if (authenticationStore.user === null) {
    await authenticationStore.getAuthStatus()
  }

  // if the user is not authenticated, save the next route
  // and  navigate them to the login page.
  // if the user is logged in and tries to go to the auth pages,
  // navigate them to the home page.
  if (to.meta.requiresAuth && !authenticationStore.isAuthenticated) {
    routeStore.setNextRoute(to.name);
    next('/login');
  } else if ((to.name == 'login' || to.name == 'signup') && authenticationStore.isAuthenticated) {
    next('/');
  } else next();
})


export default router
