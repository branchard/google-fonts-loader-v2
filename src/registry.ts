import type {AxisTuple, Family, Font} from "./types";

export const registry = new Map<Family, {
	element: HTMLLinkElement;
	axisTupleList: AxisTuple[];
}>();

export function list(): Font[] {
	return [...registry.entries()].map(entry => ({
		family: entry[0],
		axisTupleList: entry[1].axisTupleList,
	}));
}
