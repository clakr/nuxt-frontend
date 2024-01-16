<template>
  <h1>dashboard</h1>
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
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { error, status, data } = await useLaravelFetch<User[]>('/api/users')
</script>