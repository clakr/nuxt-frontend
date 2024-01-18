import type { CreateUserParameters, User } from "~/utils/types";

export const useUserStore = defineStore("user", () => {
	const nuxtApp = useNuxtApp();

	const users = ref<User[] | null>(null);

	async function fetchUsers() {
		const response = await useLaravelFetch<User[]>("/api/users", {
			key: "users",
			getCachedData(key) {
				return nuxtApp.static.data[key] || nuxtApp.payload.data[key];
			},
		});

		users.value = response.data.value;

		return response;
	}

	async function removeUserFromUsers(index: number | undefined) {
		if (!index) return console.error("No index found");
		if (!users.value) return console.error("No users.value found");

		users.value.splice(index, 1);
	}

	async function createUser({ name, email }: CreateUserParameters) {
		await useLaravelFetch("/api/users", {
			method: "POST",
			body: {
				name,
				email,
			},
			async onRequest() {
				if (!users.value) {
					await fetchUsers();
				}

				users.value?.push({
					id: 0,
					name,
					email,
					email_verified_at: null,
					created_at: new Date(),
					updated_at: new Date(),
				});
			},
			onResponse({ response: { _data } }) {
				if (!users.value) return console.error("No users.value found");

				const user = _data as User;

				const createdUserIndex = users.value.findIndex(
					({ email }) => user.email === email,
				);
				if (createdUserIndex < 0)
					return console.error("No createdUserIndex found");

				users.value[createdUserIndex] = user;
			},
			onRequestError() {
				removeUserFromUsers(
					users.value?.findLastIndex((user) => email === user.email),
				);
			},
			onResponseError() {
				removeUserFromUsers(
					users.value?.findLastIndex((user) => email === user.email),
				);
			},
		});
	}

	async function deleteUser(user: User) {
		await useLaravelFetch(`/api/users/${user.id}`, {
			method: "DELETE",
			onRequest() {
				removeUserFromUsers(
					users.value?.findIndex(({ email }) => user.email === email),
				);
			},
			onResponseError() {
				if (!users.value) return console.error("No users.value found");

				users.value.push(user);
			},
		});
	}

	return { users, fetchUsers, createUser, deleteUser };
});
