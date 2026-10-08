import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import ManagerDashboard from '../views/ManagerDashboard.vue';
import CustomerPage from '../views/CustomerPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/login' 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/manager',
    name: 'Manager',
    component: ManagerDashboard,
   // meta: { requiresAuth: true, role: 'manager' }
  },
  {
    path: '/customer',
    name: 'Customer',
    component: CustomerPage,
    //meta: { requiresAuth: true, role: 'customer' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export const logout = () => {
  localStorage.removeItem('user');
  // Перенаправляем на страницу входа
  router.push('/login');
};

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user');
  const user = isAuthenticated ? JSON.parse(isAuthenticated) : null;

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/login');
    } else if (to.meta.role && user.role !== to.meta.role) {
      // Если у пользователя нет необходимой роли
      next(user.role === 'manager' ? '/manager' : '/customer'); // Перенаправляем на соответствующую страницу
    } else {
      // Если авторизован и роль соответствует
      next();
    }
  } else if (to.path === '/login' && isAuthenticated) {
    // Если пользователь уже авторизован и пытается перейти на страницу входа
    next(user.role === 'manager' ? '/manager' : '/customer');
  } else {
    next();
  }
});

export default router;