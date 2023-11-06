import React from "npm:react";
import ReactDom from "npm:react-dom/server";
import { Document } from "../layouts/document.jsx";
import { transform } from "https://deno.land/x/esbuild/mod.js";
import { resolve, toFileUrl } from "https://deno.land/std@0.205.0/path/mod.ts";

export async function reactResponder(path){	
	const moduleImportPath = toFileUrl(resolve(Deno.cwd(), path));
	const mod = await import(moduleImportPath);
	const props = await mod.getServerProps();
	const title = mod.getTitle?.();
	const page = await Deno.readTextFile(path);
	const transpiledPage = await transform(page, { loader: "tsx" });
	const script = `
		${transpiledPage.code}

		import * as ReactDom from "https://esm.sh/react-dom@18.2.0";
		ReactDom.hydrateRoot(document.querySelector("#react-root"), React.createElement("${mod.default.name}", ${ JSON.stringify(props) }));
	`; 

	const importMap = {
		imports: {
			"npm:react": "https://esm.sh/react@18.2.0"
		}
	};

	const stream = await ReactDom.renderToReadableStream(
		React.createElement(Document, { title, script, importMap },
			React.createElement(mod.default, props)));
	return new Response(stream, {
		headers: {
			"Content-Type": "text/html"
		}
	});
}