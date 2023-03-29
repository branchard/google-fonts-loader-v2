const fontsMetadataUrl = "https://fonts.google.com/metadata/fonts";

(async () => {
	const response = await fetch(fontsMetadataUrl);
	const metadata = await response.json() as Metadata;

	const soredAxisRegistry = metadata.axisRegistry.sort((a, b) => a.tag.localeCompare(b.tag, "en"));

	// Generate axis definition
	const axisUnion = soredAxisRegistry.map(axis => [
		"{",
		`\ttag: "${axis.tag}";`,
		`\tvalue: ${axis.fallbackOnly ? axis.fallbacks.map(f => f.value).join(" | ") : "NumberOrRange"};`,
		"}",
	].join("\n")).join(" | ");

	// Get axis default values
	const defaults = soredAxisRegistry.map(axis => `${axis.tag}: ${axis.defaultValue}`).join(",\n");

	console.log(`Axis:\n${axisUnion}\n\n${defaults}`);

	// Not used
	//
	// const fontsUnion = metadata.familyMetadataList.sort((a, b) => a.family.localeCompare(b.family, "en")).map(fontFamily => {
	// 	const axes: Axis[] = [...fontFamily.axes];
	//
	// 	if (Object.keys(fontFamily.fonts).some(name => /^\d{3}i$/.test(name))) {
	// 		axes.push({
	// 			tag: "ital",
	// 		});
	// 	}
	//
	// 	if (!axes.some(axis => axis.tag === "wght")) {
	// 		axes.push({
	// 			tag: "wght",
	// 		});
	// 	}
	//
	// 	return [
	// 		"{",
	// 		`\tfamily: ${fontFamily.family};`,
	// 		`\taxisTupleList: ${fontFamily.axes.map(axis => `"${axis.tag}"`).join(" | ")};`,
	// 		"}",
	// 	].join("\n");
	// }).join(" | ");
})();

type Metadata = {
	axisRegistry: AxisRegistryItem[];
	familyMetadataList: FamilyMetadata[];
};

type AxisRegistryItem = {
	tag: string;
	displayName: string;
	min: number;
	defaultValue: number;
	max: number;
	precision: number;
	description: string;
	fallbackOnly: boolean;
	illustrationUrl?: string;
	fallbacks: Array<{
		name: string;
		value: number;
		displayName: string;
	}>;
};

type FamilyMetadata = {
	family: string;
	displayName?: string;
	category: string;
	size: number;
	subsets: string[];
	fonts: Fonts;
	axes: Axis[];
	designers: string[];
	lastModified: string;
	dateAdded: string;
	popularity: number;
	trending: number;
	defaultSort: number;
	androidFragment?: string;
	isNoto: boolean;
	colorCapabilities: string[];
	primaryScript: string;
	primaryLanguage: string;
};

type Fonts = {
	[key in ("1" | "100" | "1000" | "1000i" | "100i" | "1i" | "200" | "200i" | "300" | "300i" | "400" | "400i" | "500" | "500i" | "600" | "600i" | "700" | "700i" | "800" | "800i" | "900" | "900i")]?: {
		thickness?: number;
		slant?: number;
		width?: number;
		lineHeight?: number;
	};
};

type Axis = {
	tag: string;
};
