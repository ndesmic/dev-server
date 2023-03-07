export async function probeStat(filepaths){
	for(const filepath of filepaths){
		try {
			const fileInfo = await Deno.stat(filepath);
			return [fileInfo, filepath];
		} catch (ex){
			if(ex.code === "ENOENT") continue;
		}
	}
}