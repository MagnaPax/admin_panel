<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
</script>

<template>
    <nav class="container">
        <RouterLink to="/home">Dashboard</RouterLink>
        <RouterLink to="/brand">Brands</RouterLink>
        <RouterLink to="/category">Categories</RouterLink>
        <RouterLink to="/product">Products</RouterLink>
    </nav>
</template>
