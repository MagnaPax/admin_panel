<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <header>
        <RouterLink to="/home">
            <div>
                <img class="logo" src="@/assets/H_logo.jpg" alt="logo" />
            </div>
        </RouterLink>
    </header>
</template>

<style scoped>
header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #333;
    color: #fff;
    padding: 20px;
}

.logo-container {
    margin-left: auto;
}

.logo {
    width: 100px;
    height: 100px;
}
</style>