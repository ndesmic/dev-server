export function getServerProps(){
	return {
		name: "John Doe",
		userId: 123,
		dob: "5/6/1990"
	};
}

export function getTitle(){
	return "My React App";
}

export function getRootComponent(){
	return ["./js/components/app.jsx", "App"];
}