import { transform, stop } from "https://deno.land/x/esbuild/mod.js";

export const name = "transpile";

const extensions = [
	"jsx",
	"ts",
	"tsx"
];

export function match(path) {
	const ext = path.split(".").filter(x => x).slice(1).join(".");
	return extensions.includes(ext);
}

export function defaultPaths(barePath) {
	return extensions.map(ext => barePath + "." + ext);
}

export default async function transpileResponder(path) {
	const codeText = await Deno.readTextFile(path);
	const transpiled = await transform(codeText, { loader: "tsx" });

	return new Response(transpiled.code, {
		headers: {
			"Content-Type": "application/javascript"
		}
	});
}

export function dispose(){
	stop();
}