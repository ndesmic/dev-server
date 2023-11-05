const hmrEventSource = new EventSource("/_hmr");
hmrEventSource.addEventListener("hmr", (event) => {
	console.log(`HMR event`, event.data);
});