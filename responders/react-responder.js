import React from "npm:react";
import ReactDom from "npm:react-dom/server";
import { Document } from "../layouts/document.jsx";
import { resolve, toFileUrl } from "https://deno.land/std@0.205.0/path/mod.ts";

const extensions = [
	"react.js",
	"react.jsx",
	"react.ts",
	"react.tsx",
];

export function match(path){
	const ext = path.split(".").filter(x => x).slice(1).join(".");
	return extensions.includes(ext);
}

export function defaultPaths(barePath){
	return extensions.map(ext => barePath + "." + ext);
}

export default async function reactResponder(path){	
	const moduleImportPath = toFileUrl(resolve(Deno.cwd(), path));
	const mod = await import(moduleImportPath);
	const props = await mod.getServerProps();
	const title = await mod.getTitle?.();
	const [componentPath, exportName] = await mod.getRootComponent();

	const script = `
		import * as React from "npm:react";
		import * as ReactDom from "npm:react-dom";
		import { ${exportName ?? "default"} } from "${componentPath}";
		ReactDom.hydrateRoot(document.querySelector("#react-root"), React.createElement(${exportName}, ${ JSON.stringify(props) }));
	`; 

	const componentMod = await import(new URL(componentPath, moduleImportPath));
	const importMap = {
		imports: {
			"npm:react": "https://esm.sh/react@18.2.0",
			"npm:react-dom": "https://esm.sh/react-dom@18.2.0"
		}
	};

	const stream = await ReactDom.renderToReadableStream(
		React.createElement(Document, { title, script, importMap },
			React.createElement(componentMod[exportName], props)));
	return new Response(stream, {
		headers: {
			"Content-Type": "text/html"
		}
	});
}