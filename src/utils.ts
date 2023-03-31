import type {Axis, AxisTuple, NumberOrRange} from "./types";
import {type Font, isRange, type Options} from "./types";

/* eslint-disable @typescript-eslint/naming-convention */
const axisDefaults: {[tag in Axis["tag"]]: Extract<Axis, {tag: tag}>["value"]} = {
	BNCE: 0,
	CASL: 0,
	CRSV: 0.5,
	EDPT: 100,
	EHLT: 12,
	ELGR: 1,
	ELSH: 0,
	FILL: 0,
	FLAR: 0,
	GRAD: 0,
	HEXP: 0,
	INFM: 0,
	ital: 0,
	MONO: 0,
	MUTA: 0,
	opsz: 14,
	ROND: 0,
	slnt: 0,
	SOFT: 0,
	SPAC: 0,
	wdth: 100,
	wght: 400,
	WONK: 0,
	XOPQ: 88,
	XROT: 0,
	XTRA: 400,
	YEAR: 2000,
	YOPQ: 116,
	YROT: 0,
	YTAS: 750,
	YTDE: -250,
	YTFI: 600,
	YTLC: 500,
	YTUC: 725,
};

/* eslint-enable @typescript-eslint/naming-convention */

export function getQueryStringForAxisTupleList(axisTupleList: AxisTuple[]): string {
	const orderedTags: Array<Axis["tag"]> = [];
	for (const tuple of axisTupleList) {
		for (const axis of tuple) {
			if (!orderedTags.includes(axis.tag)) {
				orderedTags.push(axis.tag);
			}
		}
	}

	if (orderedTags.length === 0) {
		return "";
	}

	// Tags must be sorted alphabetically as the documentation says: https://developers.google.com/fonts/docs/css2#api_url_specification
	orderedTags.sort((a, b) => a.localeCompare(b, "en"));

	const axisTupleListStringBuilder: NumberOrRange[][] = [];
	let index = 0;
	for (const tuple of axisTupleList) {
		axisTupleListStringBuilder[index] = [];
		for (const tag of orderedTags) {
			const axis = tuple.find(a => a.tag === tag);
			axisTupleListStringBuilder[index].push(axis ? axis.value : axisDefaults[tag]);
		}

		index++;
	}

	// Tuples must also be sorted numerically
	axisTupleListStringBuilder.sort((a, b) => {
		/* eslint-disable-next-line @typescript-eslint/no-for-in-array,guard-for-in */
		for (const index in a) {
			const atA = numberOrRangeToNumber(a[index]);
			const atB = numberOrRangeToNumber(b[index]);

			if (atA !== atB) {
				return atA - atB;
			}
		}

		return 0;
	});

	return `${orderedTags.join(",")}@${axisTupleListStringBuilder.map(a => a.map(v => isRange(v) ? `${v.min}..${v.max}` : v).join(",")).join(";")}`;
}

export function generateFontUrl(font: Font, options?: Options): string {
	const axisQueryString = getQueryStringForAxisTupleList(font.axisTupleList);

	const searchParametersEntries: {family: string; text?: string; display?: string} = {
		family: font.family + (axisQueryString.length > 0 ? `:${axisQueryString}` : ""),
	};

	if (options?.text !== undefined) {
		searchParametersEntries.text = options.text;
	}

	if (options?.display !== undefined) {
		searchParametersEntries.display = options.display;
	}

	const searchParameters = new URLSearchParams(searchParametersEntries);

	return `https://fonts.googleapis.com/css2?${decodeURIComponent(searchParameters.toString())}`;
}

/**
 * Merge a2 in a1 and return the result
 */
export function mergeAxisTupleLists(a1: AxisTuple[], a2: AxisTuple[]): {changed: boolean; merged: AxisTuple[]} {
	const newAxisTupleList: AxisTuple[] = [...a1];

	let changed = false;
	for (const axisTuple2 of a2) {
		// Check if axisTupleFromLongest not already exist in newAxisTupleList
		if (!newAxisTupleList.some(newAxisTuple => areAxisTuplesEquals(newAxisTuple, axisTuple2))) {
			newAxisTupleList.push(axisTuple2);
			changed = true;
		}
	}

	return {
		changed,
		merged: newAxisTupleList,
	};
}

function areAxisTuplesEquals(axisTuple1: AxisTuple, axisTuple2: AxisTuple): boolean {
	let longestAxisTuple: AxisTuple = axisTuple1;
	let shortestAxisTuple: AxisTuple = axisTuple2;

	if (axisTuple2.length > axisTuple1.length) {
		longestAxisTuple = axisTuple2;
		shortestAxisTuple = axisTuple1;
	}

	for (const axis1 of longestAxisTuple) {
		// Check if axis1 is not present in shortestAxisTuple
		if (!shortestAxisTuple.some(axis2 => areAxisEquals(axis1, axis2) || areAxisEquals(axis1, {tag: axis1.tag, value: axisDefaults[axis1.tag]} as Axis))) {
			return false;
		}
	}

	return true;
}

function areAxisEquals(axis1: Axis, axis2: Axis): boolean {
	if (axis1.tag !== axis2.tag) {
		return false;
	}

	if (isRange(axis1.value)) {
		if (!isRange(axis2.value)) {
			return false;
		}

		return axis1.value.min === axis2.value.min && axis1.value.max === axis2.value.max;
	}

	if (isRange(axis2.value)) {
		return false;
	}

	return axis1.value === axis2.value;
}

function numberOrRangeToNumber(v: NumberOrRange): number {
	return isRange(v) ? v.min : v;
}
