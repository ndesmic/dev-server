import { assertEquals } from "https://deno.land/std@0.207.0/assert/mod.ts";
import * as serverResponder from "../responders/server-responder.js";
import { globToRegExp } from "https://deno.land/std@0.207.0/path/glob_to_regexp.ts";

Deno.test("Server Responder: Matchers", () => {
	[
		["hi.js", false],
		["hi.jsx", false],
		["hi.ts", false],
		["hi.tsx", false],
		["hi.server.js", true],
		["hi.server.jsx", true],
		["hi.server.ts", true],
		["hi.server.tsx", true],
		["nested/hi.js", false],
		["nested/hi.ts", false],
		["nested/hi.jsx", false],
		["nested/hi.tsx", false],
		["nested/hi.server.js", true],
		["nested/hi.server.ts", true],
		["nested/hi.server.jsx", true],
		["nested/hi.server.tsx", true],
		["hi.txt.js", false],
		["hi.txt.jsx", false],
		["hi.txt.ts", false],
		["hi.txt.tsx", false],
		["hi.txt.server.js", true],
		["hi.txt.server.jsx", true],
		["hi.txt.server.ts", true],
		["hi.txt.server.tsx", true],
		["nested/hi.txt.js", false],
		["nested/hi.txt.jsx", false],
		["nested/hi.txt.ts", false],
		["nested/hi.txt.tsx", false],
		["nested/hi.txt.server.js", true],
		["nested/hi.txt.server.jsx", true],
		["nested/hi.txt.server.ts", true],
		["nested/hi.txt.server.tsx", true],
		["hi.txt", false],
		["hi.server.txt", false]
	].forEach(([input, expected]) => {
		assertEquals(serverResponder.match(input), expected);
	});
});

Deno.test("Server Responder: Default Paths", () => {
	[
		["hi.js", false],
		["hi.jsx", false],
		["hi.ts", false],
		["hi.tsx", false],
		["hi.server.js", true],
		["hi.server.jsx", true],
		["hi.server.ts", true],
		["hi.server.tsx", true],
		["hi.txt.js", false],
		["hi.txt.jsx", false],
		["hi.txt.ts", false],
		["hi.txt.tsx", false],
		["hi.txt.server.js", true],
		["hi.txt.server.jsx", true],
		["hi.txt.server.ts", true],
		["hi.txt.server.tsx", true],
		["hi.txt", false],
		["hi.server.txt", false]
	].forEach(([input, expected]) => {
		const regex = globToRegExp(serverResponder.defaultPaths("hi"));
		console.log(input)
		assertEquals(regex.test(input), expected);
	});
});