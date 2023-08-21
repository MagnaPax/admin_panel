<script setup lang="ts">
import { RouterView } from 'vue-router'

import Header from './components/Header.vue'
import Footer from '@/components/Footer.vue'
import SideBar from '@/components/SideBar.vue'
</script>

<template>
  <SideBar />
  <all-contents>
    <Header />
    <main>
      <RouterView />
    </main>
    <Footer />
  </all-contents>
</template>