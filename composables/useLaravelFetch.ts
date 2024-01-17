import type { UseFetchOptions } from "nuxt/app";

export function useLaravelFetch<T>(
	path: string,
	options: UseFetchOptions<T> = {},
) {
	const config = useRuntimeConfig();

	let headers: Record<string, string> = {
		accept: "application/json",
		referer: config.public.frontendUrl,
	};

	const token = useCookie("XSRF-TOKEN");
	if (token.value) {
		headers["X-XSRF-TOKEN"] = token.value;
	}

	if (process.server) {
		headers = {
			...headers,
			...useRequestHeaders(["cookie"]),
		};
	}

	return useFetch(`/laravel${path}`, {
		credentials: "include",
		watch: false,
		lazy: true,
		...options,
		headers: {
			...headers,
			...options.headers,
		},
	});
}
