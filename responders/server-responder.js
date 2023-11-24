import { resolve, toFileUrl } from "https://deno.land/std@0.205.0/path/mod.ts";

export const name = "server";

export function match(path){
	return /\.server\.(jsx?|tsx?)$/.test(path);
}

export function defaultPaths(barePath) {
	return `${barePath}{,.*}.server.{js,jsx,ts,tsx}`;
}

export default async function serverResponder(path, request){
	const moduleImportPath = toFileUrl(resolve(Deno.cwd(), path));
	const mod = await import(moduleImportPath);

	if(!request && mod.getStaticRequest){
		request = await mod.getStaticRequest(path);
	}

	if(!request?.method){
		return new Response("No Method or request", { status: 405 });
	}

	if (request.method === "GET") {
		return mod.get?.(request) ?? mod.default?.(request)
			?? new Response("Method not allowed", { status: 405 });
	} else if (request.method === "DELETE") {
		return mod.del?.(request)
			?? new Response("Method not allowed", { status: 405 });
	} else {
		return mod[request.method.toLowerCase()]?.(request)
			?? new Response("Method not allowed", { status: 405 });
	}
}