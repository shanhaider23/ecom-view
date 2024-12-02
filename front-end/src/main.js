import { createApp } from 'vue'
import App from './App.vue'
import './main.css';
import * as VueRouter from 'vue-router'
import ShoppingCartPage from './pages/ShoppingCartPage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import ProductDetailPage from './pages/ProductDetailPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDlhvhPHeVf1y5Tqtq1gXOf0uYOR3MnHdc",
  authDomain: "vue-ecom-2bb09.firebaseapp.com",
  projectId: "vue-ecom-2bb09",
  storageBucket: "vue-ecom-2bb09.firebasestorage.app",
  messagingSenderId: "724170283160",
  appId: "1:724170283160:web:e6873b7c2e822de9f198ed"
};

// Initialize Firebase
initializeApp(firebaseConfig);

createApp(App)
  .use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [{
      path: '/cart',
      component: ShoppingCartPage,
    }, {
      path: '/products',
      component: ProductsPage,
    }, {
      path: '/products/:productId',
      component: ProductDetailPage,
    }, {
      path: '/',
      redirect: '/products',
    }, {
      path: '/:pathMatch(.*)*',
      component: NotFoundPage,
    }]
  }))
  .mount('#app')
