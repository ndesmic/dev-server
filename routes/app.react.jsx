import * as React from "npm:react";
import { Counter } from "./js/components/counter.jsx";

export async function getServerProps(){
	return {
		name: "John Doe",
		userId: 123,
		dob: "5/6/1990"
	};
}

export function getTitle(){
	return "My React App";
}

export default function App(props){
	return <>
		<h1>My React App</h1>
		<p>Hello {props.name}!</p>
		<p>Your userId is {props.userId}</p>
		<p>Your date of birth is {props.dob}</p>
		<Counter />
	</>;
}