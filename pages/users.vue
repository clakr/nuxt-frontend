<template>
  <header>
    <h1>users</h1>
    <button @click="handleRefresh" type="button">refresh</button>
  </header>

  <!-- error -->
  <section v-if="status === 'error'">
    <h2>error</h2>
    {{ error }}
  </section>

  <!-- pending -->
  <section v-if="status === 'pending'">
    loading...
  </section>

  <!-- success  -->
  <section v-if="status === 'success'">

    <!-- create user -->
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

    <!-- displaying user -->
    <div>
      <article v-for="user in users">
        {{ user }}
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const form = reactive({
  name: '',
  email: ''
})

const user = useUserStore()
const { error, status, data: users, refresh } = await user.fetchUsers()

async function handleRefresh() {
  await refresh()
}

async function handleCreateUser() {
  await user.createUser(form)

  form.name = ''
  form.email = ''
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