import {expect, test} from "@playwright/test";
import type {load, loadAwait} from "../src";

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Window {
		load: typeof load;
		loadAwait: typeof loadAwait;
	}
}

const linkElementSelector = "head > link.google-fonts-loader-v2";

test.beforeEach(async ({page}, workerInfo) => {
	await page.goto(workerInfo.config.webServer!.url!);
});

test("load() › add link element to the DOM", async ({page}) => {
	await page.evaluate(() => {
		window.load({
			family: "Open Sans",
		});
	});

	await page.waitForSelector(linkElementSelector, {
		timeout: 1000,
		state: "hidden",
	});

	expect(await page.locator(linkElementSelector).count()).toBe(1);
});

test("load() › add link element to the DOM with correct href", async ({page}) => {
	await page.evaluate(() => {
		window.load({
			family: "Open Sans",
			axisTupleList: [
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 300},
				],
				[
					{tag: "ital", value: 1},
					{tag: "wght", value: 300},
				],
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
		});
	});

	await page.waitForSelector(linkElementSelector, {
		timeout: 1000,
		state: "hidden",
	});

	const linkElementLocator = page.locator(linkElementSelector);
	expect(await linkElementLocator.count()).toBe(1);
	expect(await linkElementLocator.getAttribute("href"))
		.toBe("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,500;1,300;1,500&display=swap");
});

test("loadAwait() › add link element to the DOM with correct href and without the need to wait for selector", async ({page}) => {
	await page.evaluate(async () => {
		await window.loadAwait({
			family: "Open Sans",
			axisTupleList: [
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 400},
				],
				[
					{tag: "ital", value: 1},
					{tag: "wght", value: 400},
				],
			],
		}, {
			display: "swap",
		});
	});

	const linkElementLocator = page.locator(linkElementSelector);
	expect(await linkElementLocator.count()).toBe(1);
	expect(await linkElementLocator.getAttribute("href"))
		.toBe("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;1,400&display=swap");
});

test("loadAwait() › await for the font to be fully loaded", async ({page}) => {
	const checkSpanClass = "check-span";

	const getCheckSpanWidth = async () => page.evaluate(checkSpanClass => {
		const spanElement = document.querySelector(`.${checkSpanClass}`)!;
		return spanElement.getBoundingClientRect().width;
	}, checkSpanClass);

	// Add div the body with Open Sans family
	await page.evaluate(checkSpanClass => {
		const spanElement = document.createElement("span");
		spanElement.textContent = "Lorem ipsum";
		spanElement.style.fontFamily = "Open Sans";
		spanElement.classList.add(checkSpanClass);
		document.body.append(spanElement);
	}, checkSpanClass);

	// Check if the font is not already loaded on the freshly created div, using the devtool protocol
	const fontNotLoadedWidth = await getCheckSpanWidth();
	expect(fontNotLoadedWidth).toBeGreaterThan(104);
	expect(fontNotLoadedWidth).toBeLessThan(108);

	// Load the font and await
	await page.evaluate(async () => {
		await window.loadAwait({
			family: "Open Sans",
			axisTupleList: [
				[
					{tag: "wght", value: 500},
					{tag: "wdth", value: 75},
				],
			],
		}, {
			display: "swap",
		});
	});

	// Check if the font is fully loaded
	const fontLoadedWidth = await getCheckSpanWidth();
	expect(fontLoadedWidth).toBeGreaterThan(73);
	expect(fontLoadedWidth).toBeLessThan(76);

	const linkElementLocator = page.locator(linkElementSelector);
	expect(await linkElementLocator.count()).toBe(1);
	expect(await linkElementLocator.getAttribute("href"))
		.toBe("https://fonts.googleapis.com/css2?family=Open+Sans:wdth,wght@75,500&display=swap");
});
