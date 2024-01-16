// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	nitro: {
		routeRules: {
			"/laravel/**": {
				proxy: "http://127.0.0.1:8000/**",
			},
		},
	},
	modules: ["@pinia/nuxt"],
	runtimeConfig: {
		public: {
			frontendUrl: process.env.FRONTEND_URL,
			backendUrl: process.env.BACKEND_URL,
		},
	},
});
