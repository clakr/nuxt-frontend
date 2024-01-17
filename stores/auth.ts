export const useAuthStore = defineStore("auth", () => {
	const user = ref<User | null>(null);
	const isLoggedIn = computed(() => !!user.value);

	async function fetchUser() {
		const response = await useLaravelFetch<User>("/api/user");
		user.value = response.data.value;

		return response;
	}

	async function login(credentials: LoginCredentials) {
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

	async function register(credentials: RegisterCredentials) {
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
