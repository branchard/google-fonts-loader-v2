import type {AxisTuple, Family, Font} from "./types";
import {numberOrRangeToNumber} from "./utils";

export async function awaitFontLoading(font: Font, linkElement: HTMLLinkElement): Promise<void> {
	// Must wait for the stylesheet loading before attempting to load the font
	// First, check if the stylesheet isn't already loaded, the listen for it
	if (linkElement.sheet === null) {
		await new Promise<void>(resolve => {
			linkElement.addEventListener("load", () => {
				resolve();
			});
		});
	}

	await (
		font.axisTupleList === undefined
			? awaitAxisTupleLoading(font.family, [])
			: Promise.all(font.axisTupleList.map(async axisTuple => awaitAxisTupleLoading(font.family, axisTuple)))
	);
}

async function awaitAxisTupleLoading(family: Family, tuple: AxisTuple): Promise<void> {
	const isItalic: boolean = tuple.find(axis => axis.tag === "ital")?.value === 1;
	const weightAxis = tuple.find(axis => axis.tag === "wght");
	const weight = weightAxis === undefined ? "normal" : numberOrRangeToNumber(weightAxis.value);

	// The stretch value seems to not be supported as percent value
	// const widthAxis = tuple.find(axis => axis.tag === "wdth");
	// const stretch = widthAxis === undefined ? "normal" : `${numberOrRangeToNumber(widthAxis.value)}%`;
	// const fontCssSpec = `${isItalic ? "italic" : "normal"} ${weight} ${stretch} 16px "${family}"`;

	const fontCssSpec = `${isItalic ? "italic" : "normal"} ${weight} 16px "${family}"`;

	const fontFaces = await document.fonts.load(fontCssSpec);
	if (fontFaces.length > 0) {
		return;
	}

	return new Promise((resolve, reject) => {
		const listenerCallback = () => {
			if (document.fonts.check(fontCssSpec)) {
				document.fonts.removeEventListener("loadingdone", listenerCallback);
				resolve();
			}
		};

		document.fonts.addEventListener("loadingdone", listenerCallback);
	});
}
