export default defineNuxtRouteMiddleware((to) => {
	const auth = useAuthStore();

	if (!auth.isLoggedIn) {
		return navigateTo("/", {
			replace: true,
		});
	}
});
