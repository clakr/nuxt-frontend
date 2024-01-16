<template>
    <h1>login</h1>
    <form @submit.prevent="handleLogin">
        <div>
            <label for="email">email</label>
            <input v-model="form.email" type="text" name="email" id="email">
        </div>
        <div>
            <label for="password">password</label>
            <input v-model="form.password" type="password" name="password" id="password">
        </div>
        <button type="submit">login</button>
    </form>
    {{ auth.user }}
</template>

<script setup lang="ts">

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
    email: "clarktolosa@gmail.com",
    password: "password",
})

async function handleLogin() {
    const error = await auth.login({
        email: form.email,
        password: form.password,
    })
    if (error) return console.error(error)

    // router.replace("/users")
}
</script>