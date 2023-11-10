import { typeByExtension } from "https://deno.land/std/media_types/mod.ts";
import { toFileUrl, resolve, join } from "https://deno.land/std@0.205.0/path/mod.ts";
import { probeStat } from "./utils/fs-utils.js";

const baseDir = "./routes";
const responders = await Promise.all(Array.from(Deno.readDirSync("./responders")).map(f => import(toFileUrl(resolve(join(Deno.cwd(), "./responders"), f.name)))));

Deno.serve(async req => {
	const url = new URL(req.url);
	let inputPath = url.pathname;
	const potentialFilePaths = [];

	//normalize path
	if (inputPath.endsWith("/")) {
		inputPath += "index";
	}
	if(!inputPath.includes(".")){
		potentialFilePaths.push(baseDir + inputPath + ".html");
		potentialFilePaths.push(...responders.flatMap(responder => responder.defaultPaths(baseDir + inputPath)));
	} else {
		const path = baseDir + inputPath;
		potentialFilePaths.push(path);
	}

	//find
	const fileMatch = await probeStat(potentialFilePaths);
	if(!fileMatch){
		return new Response("Not Found", { status: 404 });
	}

	const filePath = fileMatch[1];
	const ext = filePath.split(".").filter(x => x).slice(1).join(".");

	for(const responder of responders){
		if(await responder.match(filePath)){
			return responder.default(filePath, req);
		}
	}

	const file = await Deno.open(filePath);
	return new Response(file.readable, {
		headers: {
			"Content-Type": typeByExtension(ext)
		}
	});
});