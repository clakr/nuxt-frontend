<template>
    <h1>login</h1>
    <form @submit.prevent="handleSubmit">
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
</template>

<script setup lang="ts">

const router = useRouter()

const form = reactive({
    email: "clarktolosa@gmail.com",
    password: "password",
})

async function handleSubmit(event: Event) {
    const { error: cookieError } = await useLaravelFetch("/sanctum/csrf-cookie")
    if (cookieError.value) return console.error(cookieError)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const body = Object.fromEntries(formData)

    const { error: loginError } = await useLaravelFetch("/login", {
        method: "POST",
        body
    })
    if (loginError.value) return console.error(loginError)

    router.replace("users")
}
</script>