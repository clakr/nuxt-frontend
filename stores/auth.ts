type User = {
	id: number;
	name: string;
	email: string;
	email_verified_at: null;
	created_at: Date;
	updated_at: Date;
};

type Credentials = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
};

export const useAuthStore = defineStore("auth", () => {
	const user = ref<User | null>(null);
	const isLoggedIn = computed(() => !!user.value);

	async function fetchUser() {
		const response = await useLaravelFetch<User>("/api/user");
		user.value = response.data.value;

		return response;
	}

	async function login(credentials: Pick<Credentials, "email" | "password">) {
		const { error: cookieError } = await useLaravelFetch(
			"/sanctum/csrf-cookie",
		);
		if (cookieError.value) return cookieError.value;

		const { error: loginError } = await useLaravelFetch("/login", {
			method: "POST",
			body: credentials,
		});
		if (loginError.value) return loginError.value;

		const { error: userError } = await fetchUser();
		if (userError.value) return userError.value;
	}

	async function register(credentials: Credentials) {
		const { error: cookieError } = await useLaravelFetch(
			"/sanctum/csrf-cookie",
		);
		if (cookieError.value) return cookieError.value;

		const { error: registerError } = await useLaravelFetch("/register", {
			method: "POST",
			body: credentials,
		});
		if (registerError.value) return registerError.value;

		const { error: userError } = await fetchUser();
		if (userError.value) return userError.value;
	}

	async function logout() {
		await useLaravelFetch("/logout", {
			method: "POST",
		});

		user.value = null;
	}

	return { user, isLoggedIn, fetchUser, login, register, logout };
});
