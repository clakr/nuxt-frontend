<template>
    <nav>
        <div>
            <NuxtLink to="/users">users</NuxtLink>
        </div>
        <div>
            <NuxtLink to="/">login</NuxtLink>
            <NuxtLink to="/register">register</NuxtLink>
        </div>
    </nav>
</template>

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