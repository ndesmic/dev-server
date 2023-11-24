export default async function get(req) {
  const str = await "hello from handler with file extension (ts -> txt)";
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