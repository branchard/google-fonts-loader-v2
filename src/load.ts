import type {Font, Options} from "./types";
import {registry} from "./registry";
import {generateFontUrl, mergeAxisTupleLists} from "./utils";
import {awaitFontLoading} from "./listener";

export function load(font: Font, options?: Options): void {
	initLoad(font, options);
}

export async function loadAwait(font: Font, options?: Options): Promise<void> {
	const linkElement = initLoad(font, options);
	await awaitFontLoading(font, linkElement);
}

function initLoad(font: Font, options?: Options): HTMLLinkElement {
	// Check if the font is already loaded
	if (registry.has(font.family)) {
		const currentFamilyRegistryItem = registry.get(font.family)!;

		// Check if the link element was removed from the DOM by the user
		if (!currentFamilyRegistryItem.element.isConnected) {
			console.warn("A google-fonts-loader-v2 link element was removed from the dom");
			document.head.append(currentFamilyRegistryItem.element);
		}

		const mergeResult = mergeAxisTupleLists(currentFamilyRegistryItem.axisTupleList, font.axisTupleList ?? []);

		// Do nothing if nothing changed
		if (!mergeResult) {
			return currentFamilyRegistryItem.element;
		}

		currentFamilyRegistryItem.element.href = generateFontUrl({
			family: font.family,
			axisTupleList: mergeResult,
		}, options);
		currentFamilyRegistryItem.axisTupleList = mergeResult;
		return currentFamilyRegistryItem.element;
	}

	const linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	linkElement.href = generateFontUrl(font, options);
	linkElement.className = "google-fonts-loader-v2";
	document.head.append(linkElement);
	registry.set(font.family, {
		element: linkElement,
		axisTupleList: font.axisTupleList ?? [],
	});
	return linkElement;
}

