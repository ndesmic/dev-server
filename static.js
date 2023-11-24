import { ensureFileSync, expandGlob } from "https://deno.land/std@0.207.0/fs/mod.ts"
import { extension } from "https://deno.land/std@0.207.0/media_types/mod.ts";
import { join, relative, resolve, toFileUrl } from "https://deno.land/std@0.207.0/path/mod.ts";

const baseDir = "./routes";
const outDir = "./out";
//const responders = await Promise.all(Array.from(Deno.readDirSync("./responders")).map(f => import(toFileUrl(resolve(join(Deno.cwd(), "./responders"), f.name)))));

const responders = [
	await import("./responders/server-responder.js"),
	await import("./responders/react-responder.js"),
	await import("./responders/transpile-responder.js")
];

const files = expandGlob(join(Deno.cwd(), baseDir, "**"));

try {
	Deno.removeSync(join(Deno.cwd(), outDir), { recursive: true });
} catch(e){}

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
		const outPath = join(Deno.cwd(), outDir, relative(baseDir, file.path.split(".")[0]));
		const ext = extension(response.headers.get("Content-Type")) ?? "txt";
		const contentOutPath = outPath + "." + ext;

		ensureFileSync(contentOutPath);
		const outFile = Deno.createSync(contentOutPath);
		response.body.pipeTo(outFile.writable);
		console.log(`Wrote: ${contentOutPath} with responder ${responder.name} responder`);
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
console.log("Done!")