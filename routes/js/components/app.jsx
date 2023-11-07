import * as React from "npm:react";
import { Counter } from "./counter.jsx";

export function App(props) {
	return <>
		<h1>My React App</h1>
		<p>Hello {props.name}!</p>
		<p>Your userId is {props.userId}</p>
		<p>Your date of birth is {props.dob}</p>
		<Counter />
	</>;
}