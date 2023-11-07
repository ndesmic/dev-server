import React from "npm:react";

export function Counter() {
	const [value, setValue] = React.useState(0);

	return <div>
		<div className="counter">{value}</div>
		<button onClick={() => setValue(value - 1)}>-</button>
		<button onClick={() => setValue(value + 1)}>+</button>
	</div>
}