import { resolve, toFileUrl } from "https://deno.land/std@0.205.0/path/mod.ts";
export async function serverResponder(path, req){
	const moduleImportPath = toFileUrl(resolve(Deno.cwd(), path));
	const mod = await import(moduleImportPath);
	if (req.method === "GET") {
		return mod.get?.(req) ?? mod.default?.(req)
			?? new Response("Method not allowed", { status: 405 });
	} else if (req.method === "DELETE") {
		return mod.del?.(req)
			?? new Response("Method not allowed", { status: 405 });
	} else {
		return mod[req.method.toLowerCase()]?.(req)
			?? new Response("Method not allowed", { status: 405 });
	}
}