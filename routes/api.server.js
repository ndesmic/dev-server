export default async function (req) {
	const str = await "hello api!";
	return new Response(str, {
		headers: {
			"Content-Type": "text/plain"
		}
	});
}