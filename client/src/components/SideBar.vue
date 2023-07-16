<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <nav class="sidebar">
        <RouterLink to="/home">Dashboard</RouterLink>
        <RouterLink to="/brand">Brands</RouterLink>
        <RouterLink to="/category">Categories</RouterLink>
        <RouterLink to="/product">Products</RouterLink>
    </nav>
</template>

<style scoped>
.sidebar {
    background-color: #f2f2f2;
    padding: 20px;
    width: 200px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
}

.sidebar a {
    display: block;
    margin-bottom: 10px;
    color: #333;
    text-decoration: none;
}

.sidebar a:hover {
    color: #000;
    font-weight: bold;
}

.sidebar a.router-link-active {
    color: #000;
    font-weight: bold;
}

.main-content {
    margin-left: 220px;
    /* Adjust the value to create space for the sidebar */
    padding: 20px;
}
</style>