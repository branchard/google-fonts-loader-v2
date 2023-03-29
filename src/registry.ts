import type {AxisTuple, Family} from "./types";

export const registry = new Map<Family, {
	element: HTMLLinkElement;
	axisTupleList: AxisTuple[];
}>();
