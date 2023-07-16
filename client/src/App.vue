<script setup lang="ts">
import { RouterView } from 'vue-router'

import Header from './components/Header.vue'
import Footer from '@/components/Footer.vue'
import SideBar from '@/components/SideBar.vue'
</script>

<template>
  <body>
    <Header />
    <SideBar />
    <main>
      <RouterView />
    </main>
    <Footer />
  </body>
</template>

<style scoped>
main {
  margin-left: 220px;
  /* Adjust the value to create space for the sidebar */
  margin-top: 60px;
  /* Adjust the value to create space for the header */
  margin-bottom: 40px;
  /* Adjust the value to create space for the footer */
  padding: 20px;
}
</style>