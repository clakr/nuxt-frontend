import type { UseFetchOptions } from "nuxt/app";

export function useLaravelFetch<T>(
	path: string,
	options: UseFetchOptions<T> = {},
) {
	let headers: Record<string, string> = {};

	const token = useCookie("XSRF-TOKEN");
	if (token.value) {
		headers["X-XSRF-TOKEN"] = token.value;
	}

	if (process.server) {
		headers = {
			...headers,
			...useRequestHeaders(["referer", "cookie"]),
		};
	}

	return useFetch(`/laravel${path}`, {
		credentials: "include",
		watch: false,
		...options,
		headers: {
			...headers,
			...options.headers,
		},
	});
}
