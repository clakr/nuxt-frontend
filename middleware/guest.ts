export default defineNuxtRouteMiddleware((to) => {
	const auth = useAuthStore();

	if (auth.isLoggedIn) {
		return navigateTo("/dashboard", {
			replace: true,
		});
	}
});
