import { typeByExtension } from "https://deno.land/std/media_types/mod.ts";
import { extname } from "https://deno.land/std/path/mod.ts";
import { probeStat } from "./utils/fs-utils.js";

const baseDir = "./routes";

//hmr
const hmrNotifyUrl = "/_hmr";
const hmrPaths = ["./routes/js/", "./routes/css/"];

const textEncoder = new TextEncoder();
Deno.serve(async req => {
	const url = new URL(req.url);
	let inputPath = url.pathname;
	const filePaths = [];


	//hmr route
	if(inputPath === hmrNotifyUrl){
		const watcher = Deno.watchFs(hmrPaths);
		const hmrReadStream = new ReadableStream({
			async start(controller) {
				for await (const event of watcher) {
					if (event.kind !== "modify") continue;
					controller.enqueue(textEncoder.encode(`id: ${new Date().getTime()}\nevent: hmr\ndata: ${event.paths[0]}\n\n`));
				}
			}
		});
		return new Response(hmrReadStream, {
			headers: {
				"Content-Type": "text/event-stream"
			}
		});
	}

	//normalize path
	if (inputPath.endsWith("/")) {
		inputPath += "index";
	}
	if(!inputPath.includes(".")){
		filePaths.push(...[".html", ".server.js", ".server.ts", ".server.jsx", ".server.tsx"].map(ext => baseDir + inputPath + ext));
	} else {
		const path = baseDir + inputPath;
		filePaths.push(path);
	}
	
	//find
	const fileMatch = await probeStat(filePaths);
	if(!fileMatch){
		return new Response("Not Found", { status: 404 });
	}

	//read or execute
	const ext = extname(fileMatch[1]);

	switch(ext){
		case ".js": 
		case ".ts":
		case ".tsx":
		case ".jsx": { 
			if(/\.server\.(js|ts|jsx|tsx)/.test(fileMatch[1])){
				const mod = await import(fileMatch[1]);
				if(req.method === "GET"){
					return mod.get?.(req) ?? mod.default?.(req)
						?? new Response("Method not allowed", { status: 405 });
				} else if (req.method === "DELETE"){
					return mod.del?.(req)
						?? new Response("Method not allowed", { status: 405 });
				} else {
					return mod[req.method.toLowerCase()]?.(req) 
						?? new Response("Method not allowed", { status: 405 });
				}
			}
		}
		// falls through
		default: {
			const file = await Deno.open(fileMatch[1]);
			return new Response(file.readable, {
				headers: {
					"Content-Type": typeByExtension(ext)
				}
			});
		}
	}
});

