export default defineNuxtPlugin(async () => {
	const auth = useAuthStore();

	if (!auth.isLoggedIn) {
		await auth.fetchUser();
	}
});
