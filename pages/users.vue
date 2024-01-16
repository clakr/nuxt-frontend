<template>
  <h1>users</h1>
  <section>
    <h2>logged-in user</h2>
    <div>
      {{ user }}
    </div>
  </section>
</template>

<script setup lang="ts">

const { data: user, error } = await useAsyncData('user', () => $fetch("/laravel/api/user"))
if (error.value) throw createError(error.value)

</script>