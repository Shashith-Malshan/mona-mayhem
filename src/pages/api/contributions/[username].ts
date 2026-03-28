import type { APIRoute } from 'astro';

export const prerender = false;

interface CacheEntry {
	data: unknown;
	expiresAt: number;
}

// Simple in-memory cache with a 5-minute TTL to reduce upstream requests.
// Entries are evicted when expired or when the cache exceeds MAX_CACHE_SIZE.
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 500;

function getCached(key: string): unknown | null {
	const entry = cache.get(key);
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) {
		cache.delete(key);
		return null;
	}
	return entry.data;
}

function setCached(key: string, data: unknown): void {
	// Evict the oldest entry when the cache is full
	if (cache.size >= MAX_CACHE_SIZE) {
		const oldestKey = cache.keys().next().value;
		if (oldestKey !== undefined) {
			cache.delete(oldestKey);
		}
	}
	cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// Validate that the username contains only characters allowed by GitHub.
// Rules: 1–39 characters, alphanumeric or hyphens, no leading/trailing hyphens.
const VALID_USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export const GET: APIRoute = async ({ params }) => {
	const { username } = params;

	if (!username || !VALID_USERNAME_RE.test(username)) {
		return new Response(JSON.stringify({ error: 'Invalid username' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Return cached response if still fresh
	const cached = getCached(username);
	if (cached !== null) {
		return new Response(JSON.stringify(cached), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'X-Cache': 'HIT',
			},
		});
	}

	try {
		const upstreamUrl = `https://github.com/${encodeURIComponent(username)}.contribs`;
		const upstream = await fetch(upstreamUrl, {
			headers: { Accept: 'application/json' },
		});

		if (upstream.status === 404) {
			return new Response(JSON.stringify({ error: 'GitHub user not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (!upstream.ok) {
			return new Response(
				JSON.stringify({ error: `Upstream request failed with status ${upstream.status}` }),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		const data: unknown = await upstream.json();
		setCached(username, data);

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'X-Cache': 'MISS',
			},
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		return new Response(JSON.stringify({ error: `Failed to fetch contribution data: ${message}` }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
