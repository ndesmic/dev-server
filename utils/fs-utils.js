import { expandGlob } from "https://deno.land/std@0.207.0/fs/expand_glob.ts";

export async function probeStat(filepaths){
	for(const filepath of filepaths){
		for await(const fileInfo of expandGlob(filepath)){
			return fileInfo;
		}
	}
}