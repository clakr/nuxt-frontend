// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	nitro: {
		routeRules: {
			"/backend/**": {
				proxy: "http://127.0.0.1:8000/**",
			},
		},
	},
});
