import * as React from "npm:react";

export function Document(props){
	return <html lang="en">
		<head>
			<title>{props.title ?? "dev server"}</title>
			<link rel="stylesheet" href="css/app.css" />
			{
				props.importMap
					? <script type="importmap" dangerouslySetInnerHTML={{ __html: JSON.stringify(props.importMap) }} />
					: null
			}
		</head>
		<body>
			<main id="react-root">{props.children}</main>
			<script type="module" dangerouslySetInnerHTML={{ __html: props.script ?? "" }}></script>
		</body>
	</html>
}