import { binaryStreamToString } from "../../utils/stream-utils.js";

export default async function get(req) {
	const str = await "hello from a nested api!";
	return new Response(str, {
		headers: {
			"Content-Type": "text/plain"
		}
	});
}

export async function post(req){
	const body = await binaryStreamToString(req.body);
	return new Response(`Posted some content! ${body}`, {
		headers: {
			"Content-Type": "text/plain"
		}
	});
}

export async function put(req) {
	const body = await binaryStreamToString(req.body);
	return new Response(`Put some content! ${body}`, {
		headers: {
			"Content-Type": "text/plain"
		}
	});
}

export async function del(req) {
	const body = await binaryStreamToString(req.body);
	return new Response(`Deleted some content! ${body}`, {
		headers: {
			"Content-Type": "text/plain"
		}
	});
}