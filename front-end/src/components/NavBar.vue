<template>
  <div class="nav-bar">
    <div class = "logo-box">
    <router-link to="/products" class="products-link">
      <div class="logo-wrap">
        <img :src="logo" />
      </div>
    </router-link>
    </div>
    <div class="nav-buttons-wrap">
      <div>
      <button @click="signOut" v-if="user">Sign Out</button>
      </div>
      <div>
      <router-link to="/cart" >
        <button>Shopping Cart</button>
      </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import logo from '@/assets/logo-hexagon.svg';

export default {
  name: "NavBar",
  props:['user'],
  data() {
    return {
      logo,
    };
  },
  methods: {
    async signOut() {
      try {
        const auth = getAuth();
        await signOut(auth);
        alert("Successfully signed out!");
        
      } catch (error) {
        console.error("Sign-out error:", error);
        alert("Failed to sign out. Please try again.");
      }
    },
  },
};
</script>
