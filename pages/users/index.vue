<template>
  <h1>users</h1>

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
    <form v-if="formState === 'create'" @submit.prevent="handleCreateUser">
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

    <!-- update user -->
    <form v-if="formState === 'update'" @submit.prevent="handleUpdateUser">
      <input v-model="form.id" type="hidden" name="id">
      <div>
        <label for="name">name</label>
        <input v-model="form.name" type="text" name="name" id="name">
      </div>
      <div>
        <label for="email">email</label>
        <input v-model="form.email" type="email" name="email" id="email">
      </div>
      <button type="submit">update user</button>
    </form>

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
          <th></th>
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
          <td>
            <div v-if="!isLoggedInUser(user)">
              <button type="button" @click="handleUpdateForm(user)">edit</button>
              <button type="button" @click="handleDeleteUser(user)">delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
                       
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const auth = useAuthStore()
const user = useUserStore()

const { error, status, data: users } = await user.fetchUsers()
const sortedUsers = computed(() => users.value?.toSorted((a, b) => a.id - b.id))

const form = reactive({
  id: 0,
  name: '',
  email: ''
})
const formState = ref<'create' | 'update'>('create')

async function handleCreateUser() {
  await user.createUser(form)

  form.name = ''
  form.email = ''
}

function handleUpdateForm(user: User) {
  formState.value = 'update'

  form.id = user.id
  form.name = user.name
  form.email = user.email
}

async function handleUpdateUser() {
  await user.updateUser(form)

  formState.value = 'create'
  form.name = ''
  form.email = ''
}

async function handleDeleteUser(deletedUser: User) {
  await user.deleteUser(deletedUser)
}

function isLoggedInUser({ id }: Pick<User, 'id'>) {
  return auth.user?.id === id
}

function getViewUserRoute({ id }: Pick<User, 'id'>) {
  return `/users/${id}`
}
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

td div {
  display: flex;
  column-gap: .5rem;
}
</style>