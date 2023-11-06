import { transform } from "https://deno.land/x/esbuild/mod.js";

export async function transpileResponder(path) {
	const codeText = await Deno.readTextFile(path);
	const transpiled = await transform(codeText, { loader: "tsx" });

	return new Response(transpiled.code, {
		headers: {
			"Content-Type": "text/javascript"
		}
	});
}