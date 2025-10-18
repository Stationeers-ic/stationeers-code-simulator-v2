// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

const cache = new Map();

export function fetchData<T>(url: string) {
	if (!cache.has(url)) {
		cache.set(
			url,
			fetch(url).then((d) => d.json()),
		);
	}
	return cache.get(url) as T;
}
