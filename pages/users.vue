<template>
  <header>
    <h1>users</h1>
    <button @click="handleRefresh" type="button">refresh</button>
  </header>
  <section v-if="status === 'error'">
    <h2>error</h2>
    {{ error }}
  </section>
  <section v-if="status === 'pending'">
    loading...
  </section>
  <section v-if="status === 'success'">
    <form @submit.prevent="handleCreateUser">
      <div>
        <label for="name">name</label>
        <input v-model="form.name" type="text" name="name" id="name">
      </div>
      <div>
        <label for="email">email</label>
        <input v-model="form.email" type="email" name="email" id="email">
      </div>
      <button type="submit">create user</button>
    </form>
    <div>
      <article v-for="user in users">
        {{ user }}
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()

definePageMeta({
  middleware: 'auth'
})

const form = reactive({
  name: '',
  email: ''
})

const { error, status, data: users, refresh } = await useLaravelFetch<User[]>('/api/users', {
  key: 'users',
  getCachedData(key) {
    return nuxtApp.static.data[key] || nuxtApp.payload.data[key]
  },
})

async function handleRefresh() {
  await refresh()
}

async function handleCreateUser() {
  await useLaravelFetch('/api/users', {
    method: 'POST',
    body: {
      name: form.name,
      email: form.email,
    },
    onRequest() {
      if (!users.value) return console.error("No users.value found")

      users.value.push({
        id: 0,
        name: form.name,
        email: form.email,
        email_verified_at: null,
        created_at: new Date(),
        updated_at: new Date()
      })
    },
    onResponse({ response: { _data } }) {
      if (!users.value) return console.error("No users.value found")

      const user = _data as User

      const createdUserIndex = users.value.findIndex(({ email }) => user.email === email)
      if (!createdUserIndex) return console.error("No createdUserIndex found")

      users.value[createdUserIndex] = user
    },
    onResponseError() {
      if (!users.value) return console.error("No users.value found")

      const createdUserIndex = users.value.findIndex(({ email }) => form.email === email)
      if (!createdUserIndex) return console.error("No createdUserIndex found")

      users.value.splice(createdUserIndex, 1)
    }
  })



}

</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

section:last-of-type {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
</style>