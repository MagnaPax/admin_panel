<script setup lang="ts">
import { RouterView } from 'vue-router'

import Header from '@/components/Header-Item.vue'
import Footer from '@/components/Footer-Item.vue'
import SideBar from '@/components/Sidebar-Item.vue'
</script>

<template>
  <SideBar />
  <div class="all-contents">
    <Header />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>