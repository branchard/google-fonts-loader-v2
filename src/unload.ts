import {registry} from "./registry";

export function unload() {
	return "";
}

export function unloadAll(): void {
	for (const [_, registryItem] of registry) {
		registryItem.element.remove();
	}

	registry.clear();
}
