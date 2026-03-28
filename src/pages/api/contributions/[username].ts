import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
	const { username } = params;

	if (!username) {
		return new Response(JSON.stringify({ error: 'Username is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const response = await fetch(`https://github.com/${encodeURIComponent(username)}.contribs`, {
			headers: {
				Accept: 'application/json',
			},
		});

		if (response.status === 404) {
			return new Response(JSON.stringify({ error: `User '${username}' not found` }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (!response.ok) {
			return new Response(
				JSON.stringify({ error: `Failed to fetch contribution data (HTTP ${response.status})` }),
				{
					status: response.status,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				// Cache for 1 hour: contribution graphs update at most a few times per day,
				// so stale-for-an-hour data is an acceptable trade-off vs. GitHub rate limits.
				'Cache-Control': 'public, max-age=3600',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to reach GitHub. Please try again.' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
