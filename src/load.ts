import type {Font, Options} from "./types";
import {registry} from "./registry";
import {generateFontUrl, mergeAxisTupleLists} from "./utils";

export function load(font: Font, options?: Options): void {
	// Check if the font is already loaded
	if (registry.has(font.family)) {
		const currentFamilyRegistryItem = registry.get(font.family)!;

		// Check if the link element was removed from the DOM by the user
		if (!currentFamilyRegistryItem.element.isConnected) {
			console.warn("A google-fonts-loader-v2 link element was removed from the dom");
			document.head.append(currentFamilyRegistryItem.element);
		}

		const {changed, merged} = mergeAxisTupleLists(currentFamilyRegistryItem.axisTupleList, font.axisTupleList);
		if (!changed) {
			return;
		}

		currentFamilyRegistryItem.element.href = generateFontUrl({
			family: font.family,
			axisTupleList: merged,
		}, options);
		currentFamilyRegistryItem.axisTupleList = merged;
	} else {
		const linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		linkElement.href = generateFontUrl(font, options);
		linkElement.className = "google-fonts-loader-v2";
		document.head.append(linkElement);
		registry.set(font.family, {
			element: linkElement,
			axisTupleList: font.axisTupleList,
		});
	}
}

export async function loadAndAwait(font: Font, options?: Options): Promise<void> {
	console.error("Not implemented yet");
}
