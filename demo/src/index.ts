import {list, loadAwait, unloadAll} from "google-fonts-loader-v2";

const previewSentences: string[] = [
	"If at first, you <em>don't</em> succeed, <strong>skydiving</strong> is not for you",
	"Life is too <strong>short</strong> to be <em>taken</em> seriously",
	"Procrastination <em>is</em> the <strong>thief</strong> of time",
	"Laughter <em>is</em> the <strong>best</strong> medicine",
	"Don't <strong>judge</strong> a <em>book</em> by its cover",
	"A penny <strong>saved</strong> is a <em>penny</em> earned",
	"When in <strong>doubt</strong>, <em>throw</em> it out",
	"A <em>watched</em> pot <strong>never</strong> boils",
	"Good <strong>things</strong> come to <em>those</em> who wait",
];

const shakeClassName = "shake";
const hiddenClassName = "hidden";
let curentAnimationListener: (() => void) | undefined;

loadAwait({
	family: "Open Sans",
	axisTupleList: [
		[
			{tag: "ital", value: 0},
			{tag: "wght", value: 500},
		],
		[
			{tag: "ital", value: 1},
			{tag: "wght", value: 500},
		],
	],
}, {
	display: "swap",
}).then(() => 5).catch(console.error);

function onSelect(
	selectElement: HTMLSelectElement,
	previewContainerElement: HTMLDivElement,
	previewLoaderElement: HTMLDivElement,
	previewElement: HTMLDivElement,
	timerElement: HTMLDivElement,
) {
	if (curentAnimationListener) {
		previewContainerElement.removeEventListener("animationend", curentAnimationListener);
	}

	previewElement.style.fontFamily = selectElement.value;
	previewElement.classList.add(hiddenClassName);
	previewLoaderElement.classList.remove(hiddenClassName);
	console.log("Unload all previously loaded fonts…");
	console.log(list());
	unloadAll();
	console.log("Fonts unloaded.");
	console.log(`Loading: ${selectElement.value}…`);
	const startTime = performance.now();
	loadAwait({
		family: selectElement.value,
	}, {
		display: "swap",
	}).then(() => {
		previewContainerElement.classList.add(shakeClassName);
		previewElement.classList.remove(hiddenClassName);
		previewLoaderElement.classList.add(hiddenClassName);
		previewContainerElement.addEventListener("animationend", curentAnimationListener = () => {
			previewContainerElement.classList.remove(shakeClassName);
		});
		console.log(`${selectElement.value} loaded.`);
		timerElement.textContent = `Font loaded in ${Math.round(performance.now() - startTime)}ms`;
	}).catch(console.error);
}

const selectElement = document.querySelector("select")!;
const previewContainerElement: HTMLDivElement = document.querySelector("#preview-container")!;
const previewLoaderElement: HTMLDivElement = previewContainerElement.querySelector("#preview-loader")!;
const previewElement: HTMLDivElement = previewContainerElement.querySelector("#preview")!;
const timerElement: HTMLDivElement = document.querySelector("#timer")!;

previewElement.innerHTML = previewSentences[Math.floor(Math.random() * previewSentences.length)];

onSelect(selectElement, previewContainerElement, previewLoaderElement, previewElement, timerElement);

selectElement.addEventListener("change", () => {
	onSelect(selectElement, previewContainerElement, previewLoaderElement, previewElement, timerElement);
});

// Move background with cursor
const xOffsetMin = -5;
const xOffsetMax = 5;
const yAngleMin = -65;
const yAngleMax = -35;
document.body.addEventListener("mousemove", event => {
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;
	const mouseX = event.pageX;
	const mouseY = event.pageY;

	document.body.style.setProperty("--x-offset", `${(mouseX / (windowWidth / (xOffsetMax - xOffsetMin))) + xOffsetMin}%`);
	document.body.style.setProperty("--angle", `${(mouseY / (windowHeight / (yAngleMax - yAngleMin))) + yAngleMin}deg`);
});
