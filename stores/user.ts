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

	async function retainUserData(user: User) {
		if (!users.value) return console.error("No users.value found");

		const updatedUserIndex = users.value.findIndex(({ id }) => user.id === id);
		if (!updatedUserIndex) return console.error("No updatedUserIndex found");

		users.value[updatedUserIndex] = user;
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

			// todo: refactor this (id: 1)
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

	async function updateUser({
		id,
		name,
		email,
	}: Pick<User, "id" | "name" | "email">) {
		if (!users.value) return console.error("No users.value found");

		const user = users.value.find((user) => id === user.id);
		if (!user) return console.error("No user found");

		await useLaravelFetch(`/api/users/${user.id}`, {
			method: "PUT",
			body: {
				name,
				email,
			},

			// todo: refactor this (id: 1)
			onRequest() {
				if (!users.value) return console.error("No users.value found");

				const updatedUserIndex = users.value.findIndex(
					({ id }) => user.id === id,
				);
				if (!updatedUserIndex)
					return console.error("No updatedUserIndex found");

				users.value[updatedUserIndex] = { ...user, name, email };
			},

			// todo: refactor this (id: 1)
			onResponse({ response: { _data } }) {
				if (!users.value) return console.error("No users.value found");

				const user = _data as User;

				const updatedUserIndex = users.value.findIndex(
					({ id }) => user.id === id,
				);
				if (!updatedUserIndex)
					return console.error("No updatedUserIndex found");

				users.value[updatedUserIndex] = user;
			},
			onRequestError() {
				retainUserData(user);
			},
			onResponseError() {
				retainUserData(user);
			},
		});
	}

	async function deleteUser(user: User) {
		await useLaravelFetch(`/api/users/${user.id}`, {
			method: "DELETE",
			onRequest() {
				removeUserFromUsers(users.value?.findIndex(({ id }) => user.id === id));
			},
			onResponse() {
				// no possible "hydration" of data since it's already deleted
				// instead, do something client-side e.g. display toast
			},
			onRequestError() {
				if (!users.value) return console.error("No users.value found");

				users.value.push(user);
			},
			onResponseError() {
				if (!users.value) return console.error("No users.value found");

				users.value.push(user);
			},
		});
	}

	return { users, fetchUsers, createUser, updateUser, deleteUser };
});
