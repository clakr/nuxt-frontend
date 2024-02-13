import type { CreateUserParameters, User } from "~/utils/types";

export const useUserStore = defineStore("user", () => {
	const users = ref<User[] | null>(null);

	async function fetchUsers() {
		const response = await useLaravelFetch<User[]>("/api/users");

		users.value = response.data.value;

		return response;
	}

	async function removeUser(index: number | undefined) {
		if (!index) return console.error("No index found");
		if (!users.value) return console.error("No users.value found");

		users.value.splice(index, 1);
	}

	function retainUser(user: User) {
		if (!users.value) return console.error("No users.value found");

		const updatedUserIndex = users.value.findIndex(({ id }) => user.id === id);
		if (!updatedUserIndex) return console.error("No updatedUserIndex found");

		users.value[updatedUserIndex] = user;
	}

	function replaceUser(index: number | undefined, user: User) {
		if (index === undefined || index < 0)
			return console.error("No index found");
		if (!users.value) return console.error("No users.value found");

		users.value[index] = user;
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
					emailVerifiedAt: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			},
			onResponse({ response: { _data: user } }) {
				replaceUser(
					users.value?.findIndex(({ email }) => user.email === email),
					user,
				);
			},
			onRequestError() {
				removeUser(users.value?.findLastIndex((user) => email === user.email));
			},
			onResponseError() {
				removeUser(users.value?.findLastIndex((user) => email === user.email));
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

			onRequest() {
				replaceUser(
					users.value?.findIndex(({ id }) => user.id === id),
					{
						...user,
						name,
						email,
					},
				);
			},

			onResponse({ response: { _data: user } }) {
				replaceUser(
					users.value?.findIndex(({ id }) => user.id === id),
					user,
				);
			},
			onRequestError() {
				retainUser(user);
			},
			onResponseError() {
				retainUser(user);
			},
		});
	}

	async function deleteUser(user: User) {
		await useLaravelFetch(`/api/users/${user.id}`, {
			method: "DELETE",
			onRequest() {
				removeUser(users.value?.findIndex(({ id }) => user.id === id));
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
