<template>
  <h1>dashboard</h1>

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

    <!-- displaying user -->
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>email</th>
          <th>emailVerifiedAt</th>
          <th>createdAt</th>
          <th>updatedAt</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in sortedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.emailVerifiedAt }}</td>
          <td>{{ user.createdAt }}</td>
          <td>{{ user.updatedAt }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
                       
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const user = useUserStore()

const { error, status, data: users } = await user.fetchUsers()
const sortedUsers = computed(() => users.value?.toSorted((a, b) => a.id - b.id))

</script>

<style scoped>
section:last-of-type {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

td {
  text-align: center;
}
</style>