import { ensureFileSync, expandGlob } from "https://deno.land/std@0.207.0/fs/mod.ts"
import { extension } from "https://deno.land/std@0.207.0/media_types/mod.ts";
import { join, relative, toFileUrl, resolve } from "https://deno.land/std@0.207.0/path/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { normalizeSlashes } from "./utils/fs-utils.js";

const baseDir = "./routes";
const outDir = "./out";
const responders = await Promise.all(Array.from(Deno.readDirSync("./responders")).map(f => import(toFileUrl(resolve(join(Deno.cwd(), "./responders"), f.name)))));

const files = expandGlob(join(Deno.cwd(), baseDir, "**"));

try {
	Deno.removeSync(join(Deno.cwd(), outDir), { recursive: true });
} catch(e){}

const importMap = { imports: {}};
for await (const file of files) {
	if(file.isDirectory) continue;

	let handled = false;
	for(const responder of responders){
		if(!responder.match(file.path)) continue;
		const response = await responder.default(file.path);
		if(!response.ok){
			console.log(`Skipped: ${file.path} returned a non-successful status`);
			continue;
		}
		const ext = extension(response.headers.get("Content-Type")) ?? "txt";
		const filePathToRoot = relative(baseDir, file.path.split(".")[0] + "." + ext);
		const outPath = join(Deno.cwd(), outDir, filePathToRoot);

		const originalFilePathToRoot = relative(baseDir, file.path);
		if(originalFilePathToRoot !== filePathToRoot){
			importMap.imports["/" + normalizeSlashes(originalFilePathToRoot)] = "/" + normalizeSlashes(filePathToRoot);
		}

		ensureFileSync(outPath);
		const outFile = Deno.createSync(outPath);
		response.body.pipeTo(outFile.writable);
		console.log(`Wrote: ${outPath} with responder ${responder.name} responder`);
		handled = true;
	}

	if(!handled){
		const outPath = join(Deno.cwd(), outDir, relative(baseDir, file.path));
		ensureFileSync(outPath);
		Deno.copyFileSync(file.path, outPath);
		console.log(`Wrote: ${outPath} with default responder`);
	}
}

for(const responder of responders){
	responder.dispose?.();
}

//possible conflict if this exists...
// Deno.writeTextFileSync(join(outDir, "importmap.json"), JSON.stringify({
// 	imports: importMap
// }, null, 4));
// console.log("Wrote importmap.json");


const htmlFiles = expandGlob(join(Deno.cwd(), outDir, "**/*html"));
for await(const htmlFile of htmlFiles){
	const content = Deno.readTextFileSync(htmlFile.path);
	const document = new DOMParser().parseFromString(content, "text/html");
	const script = document.createElement("script");
	script.setAttribute("type", "importmap");
	
	const importMapEl = document.querySelector("script[type=importmap]");
	if(importMapEl) {
		const oldImportMap = JSON.parse(importMapEl.innerText);
		Object.assign(oldImportMap.imports, importMap.imports);
		script.innerText = JSON.stringify(oldImportMap);
		importMapEl.remove();
	} else {
		script.innerText = JSON.stringify(importMap, null, 4);
	}
	
	if(document.head.childNodes.length > 0){
		document.head.insertBefore(script, document.head.childNodes[0]);
	} else {
		document.head.appendChild(script);
	}
	Deno.writeTextFileSync(htmlFile.path, document.documentElement.outerHTML); 
}

console.log("Done!")