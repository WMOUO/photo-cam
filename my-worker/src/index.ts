export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { method } = request;
		const url = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
					'Access-Control-Max-Age': '86400',
				}
			});
		}

		if (method === 'POST' && url.pathname === '/api/upload') {
			const body = await request.json() as { image: string };
			const { image } = body;

			if (!image || !image.startsWith('data:image')) {
			return new Response('Invalid image data', { status: 400 });
			}

			const base64 = image.split(',')[1];
			const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

			const now = new Date();
			const pad = (n: number) => n.toString().padStart(2, '0');
			const filename = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.png`;

			await env.PHOTOS.put(filename, binary);

			return new Response(JSON.stringify({ success: true, filename }), {
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
			});
		}

		if (method === 'GET' && url.pathname === '/api/list') {
			const list = await env.PHOTOS.list();
			const bucketName = 'photo-cam'; // 你自己建立的 bucket 名稱
			const files = list.objects.map(obj =>
			`https://${env.CF_R2_PUBLIC_HOST}/${bucketName}/${obj.key}`
			);

			return new Response(JSON.stringify({ files }), {
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
			});
		}

		return new Response('Not Found', { status: 404 });
		}
	};

	interface Env {
		PHOTOS: R2Bucket;
		CF_R2_PUBLIC_HOST: string;
	}
