import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from './components/UserLogin.vue';
import UserRegister from './components/UserRegister.vue';
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/register',
      name: 'register',
      component: UserRegister
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskList
    },
    {
      path: '/tasks/edit/:id',
      name: 'editTask',
      component: TaskForm,
      props: true
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user-token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});

export default router;