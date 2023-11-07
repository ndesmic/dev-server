import { typeByExtension } from "https://deno.land/std/media_types/mod.ts";
import { extname } from "https://deno.land/std/path/mod.ts";
import { probeStat } from "./utils/fs-utils.js";

const baseDir = "./routes";

Deno.serve(async req => {
	const url = new URL(req.url);
	let inputPath = url.pathname;
	const filePaths = [];

	//normalize path
	if (inputPath.endsWith("/")) {
		inputPath += "index";
	}
	if(!inputPath.includes(".")){
		filePaths.push(...[
			".html", 
			".server.js", 
			".server.ts", 
			".server.jsx", 
			".server.tsx", 
			".react.js",
			".react.jsx",
			".react.tsx"
		].map(ext => baseDir + inputPath + ext));
	} else {
		const path = baseDir + inputPath;
		filePaths.push(path);
	}

	//find
	const fileMatch = await probeStat(filePaths);
	if(!fileMatch){
		return new Response("Not Found", { status: 404 });
	}

	const filePath = fileMatch[1];
	const ext = filePath.split(".").filter(x => x).slice(1).join(".");

	switch(ext){
		case "jsx":
		case "ts":
		case "tsx":
		{
			const mod = await import("./responders/transpile-responder.js");
				return mod.transpileResponder(filePath);
		}
		case "server.js": 
		case "server.ts":
		case "server.jsx":
		case "server.tsx":
		{ 
			const mod = await import("./responders/server-responder.js");
				return mod.serverResponder(filePath, req);
		}
		case "react.js":
		case "react.jsx":
		case "react.ts":
		case "react.tsx":
		{
			const mod = await import("./responders/react-responder.js");
				return mod.reactResponder(filePath);
		}
		// falls through
		default: {
			const file = await Deno.open(filePath);
			return new Response(file.readable, {
				headers: {
					"Content-Type": typeByExtension(ext)
				}
			});
		}
	}
});