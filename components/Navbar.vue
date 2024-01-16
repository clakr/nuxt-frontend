<template>
    <nav>
        <div>
            <NuxtLink to="/users">users</NuxtLink>
        </div>
        <div>
            {{ auth.user }}
            <NuxtLink to="/">login</NuxtLink>
            <NuxtLink to="/register">register</NuxtLink>
            <button @click="handleLogout">logout</button>
        </div>
    </nav>
</template>

<script setup lang="ts">
const auth = useAuthStore()

async function handleLogout() {
    await auth.logout()
}
</script>

<style scoped lang="scss">
nav {
    display: flex;
    justify-content: space-between;

    &>div {
        display: flex;
        column-gap: .5rem;
    }
}
</style>