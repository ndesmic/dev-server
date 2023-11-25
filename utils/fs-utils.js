import { expandGlob } from "https://deno.land/std@0.207.0/fs/expand_glob.ts";
import { SEP } from "https://deno.land/std@0.208.0/path/windows/mod.ts";

export async function probeStat(filepaths){
	for(const filepath of filepaths){
		for await(const fileInfo of expandGlob(filepath)){
			return fileInfo;
		}
	}
}

export function normalizeSlashes(path){
	return path.replaceAll(SEP, "/");
}