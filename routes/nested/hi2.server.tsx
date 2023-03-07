export default async function get(req) {
	const str = await "hello from tsx nested api!";
	return new Response(str, {
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
