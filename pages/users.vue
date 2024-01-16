<template>
  <h1>users</h1>
  <section v-if="status === 'error'">
    <h2>error</h2>
    {{ error }}
  </section>
  <section v-if="status === 'pending'">
    loading...
  </section>
  <section v-if="status === 'success'">
    {{ data }}
  </section>
  <button @click="handleRefresh" type="button">refresh</button>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { error, status, data, refresh } = await useLaravelFetch<User[]>('/api/users')

async function handleRefresh() {
  await refresh()
}

</script>