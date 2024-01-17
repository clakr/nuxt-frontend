import type { CreateUserParameters } from "~/utils/types";

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

	async function removeAppendedUser({
		email,
	}: Pick<CreateUserParameters, "email">) {
		if (!users.value) return console.error("No users.value found");

		const createdUserIndex = users.value.findLastIndex(
			(user) => email === user.email,
		);
		if (createdUserIndex < 0) return console.error("No createdUserIndex found");

		users.value.splice(createdUserIndex, 1);
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
				removeAppendedUser({ email });
			},
			onResponseError() {
				removeAppendedUser({ email });
			},
		});
	}

	return { users, fetchUsers, createUser };
});
