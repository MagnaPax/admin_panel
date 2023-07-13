<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
</script>

<template>
    <div class="wrapper">
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
        </nav>
    </div>
</template>
