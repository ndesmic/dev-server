const counter = document.querySelector("#counter");
const plus = document.querySelector("#plus");
const minus = document.querySelector("#minus");
let value = 0;

plus.addEventListener("click", () => {
	value++;
	counter.textContent = value;
});

minus.addEventListener("click", () => {
	value--;
	counter.textContent = value;
});