export function getServerProps(req) {
	const name = new URL(req.url).searchParams.get("name");
	return {
		name: name ?? "[Unknown]",
		userId: 123,
		dob: "5/6/1990"
	};
}

export function getTitle() {
	return "My React App";
}

export function getRootComponent() {
	return ["../js/components/app.jsx", "App"];
}

export function getStaticRequest(path) {
	return new Request(path + `?name=Dave Daverson`, {
		method: "get"
	});
}