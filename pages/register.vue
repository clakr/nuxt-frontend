<template>
    <h1>register</h1>
    <form @submit.prevent="handleRegister">
        <div>
            <label for="name">name</label>
            <input v-model="form.name" type="text" name="name" id="name">
        </div>
        <div>
            <label for="email">email</label>
            <input v-model="form.email" type="text" name="email" id="email">
        </div>
        <div>
            <label for="password">password</label>
            <input v-model="form.password" type="password" name="password" id="password">
        </div>
        <div>
            <label for="password_confirmation">password_confirmation</label>
            <input v-model="form.password_confirmation" type="password" name="password_confirmation"
                id="password_confirmation">
        </div>
        <button type="submit">register</button>
    </form>
</template>

<script setup lang="ts">

const auth = useAuthStore()

const form = reactive({
    name: "Clark Tolosa",
    email: "clarktolosa@gmail.com",
    password: "password",
    password_confirmation: "password",
})

async function handleRegister() {
    const error = await auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation
    })
    if (error) return console.error(error)
}
</script>