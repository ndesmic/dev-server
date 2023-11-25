export default async function get(req) {
	const str = await "hello from jsx nested api!";
	return new Response(str, {
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

export function getStaticRequest(path) {
	return new Request(path, {
		method: "get"
	});
}