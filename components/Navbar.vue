<template>
    <nav>
        <div>
            <NuxtLink to="/users">users</NuxtLink>
        </div>
        <div>
            <NuxtLink to="/">login</NuxtLink>
            <NuxtLink to="/register">register</NuxtLink>
            <button @click="handleLogout">logout</button>
        </div>
    </nav>
</template>

<script setup lang="ts">
const router = useRouter()

async function handleLogout() {
    await useLaravelFetch("/logout", {
        method: 'POST',
    })

    router.replace("/")
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