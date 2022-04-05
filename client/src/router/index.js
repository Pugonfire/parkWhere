import { createWebHistory, createRouter } from 'vue-router';
import Login from '@/views/Login.vue';
import NotFound from '@/views/NotFound.vue';
import ParkNow from '@/views/ParkNow.vue';
import Search from '@/views/Search.vue';
import Favourites from '@/views/Favourites.vue';
import CarparkDetails from '@/views/CarparkDetails.vue';

const routes = [
  {
    path: '/',
    name: 'ParkNow',
    component: ParkNow,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    path: '/favourites',
    name: 'Favourites',
    component: Favourites,
  },
  {
    path: '/carparkdetails',
    name: 'Details',
    component: CarparkDetails,
    props: true,
  },
  {
    path: '/:catchAll(.*)',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
