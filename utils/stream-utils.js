export async function textStreamToString(stream) {
	const reader = stream.getReader();
	let text = "";
	let done = false;

	while (!done) {
		const result = await reader.read();
		done = result.done;
		if (result.value) {
			text += result.value;
		}
	}

	return text;
}

export async function binaryStreamToString(stream) {
	return await textStreamToString(stream.pipeThrough(new TextDecoderStream()));
}