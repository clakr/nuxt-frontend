<template>
    <nav>
        <div v-if="auth.isLoggedIn">
            <NuxtLink to="/dashboard">dashboard</NuxtLink>
            <NuxtLink to="/users">users</NuxtLink>
        </div>
        <div v-if="!auth.isLoggedIn">
            <NuxtLink to="/">login</NuxtLink>
            <NuxtLink to="/register">register</NuxtLink>
        </div>
        <div v-if="auth.isLoggedIn">
            {{ auth.user }}
            <button type="button" @click="handleLogout">logout</button>
        </div>
    </nav>
</template>

<script setup lang="ts">
const auth = useAuthStore()

async function handleLogout() {
    await auth.logout()
    clearNuxtData()

    navigateTo("/", {
        replace: true,
    })
}
</script>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
}

div {
    display: flex;
    column-gap: .5rem;
}
</style>