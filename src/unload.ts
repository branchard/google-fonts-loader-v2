import type {Font} from "./types";
import {registry} from "./registry";

export function unload(font: Font): void {
	// For now, only unload font based on font name
	if (registry.has(font.family)) {
		registry.delete(font.family);
	}
	// eslint-disable-next-line no-warning-comments
	// TODO: must return list of unloaded fonts
}

export function unloadAll(): void {
	for (const [_, registryItem] of registry) {
		registryItem.element.remove();
	}

	registry.clear();
}
