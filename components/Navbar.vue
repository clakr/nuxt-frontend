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

<script setup>
async function handleLogout() {
    await useFetch("/backend/logout", {
        credentials: 'include',
        method: 'post',
        headers: {
            "x-xsrf-token": useCookie("XSRF-TOKEN") || "NO_COOKIE"
        }
    })
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