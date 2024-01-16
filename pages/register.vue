<template>
    <h1>register</h1>
    <form @submit.prevent="handleSubmit">
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

const router = useRouter()

const form = reactive({
    name: "Clark Tolosa",
    email: "clarktolosa@gmail.com",
    password: "password",
    password_confirmation: "password",
})

async function handleSubmit(event: Event) {
    const { error: cookieError } = await useLaravelFetch("/sanctum/csrf-cookie", {
        credentials: "include"
    })
    if (cookieError.value) return console.error(cookieError)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const body = Object.fromEntries(formData)

    const { error: registerError } = await useLaravelFetch("/register", {
        method: "POST",
        body
    })
    if (registerError.value) return console.error(registerError)

    router.replace("/users")
}
</script>