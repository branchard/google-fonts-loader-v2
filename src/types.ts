export type Family = string;

export type Range = {
	min: number;
	max: number;
};

export type NumberOrRange = number | Range;

export function isRange(numberOrRange: NumberOrRange): numberOrRange is Range {
	return typeof numberOrRange === "object";
}

export type Axis = {
	tag: "BNCE";
	value: NumberOrRange;
} | {
	tag: "CASL";
	value: NumberOrRange;
} | {
	tag: "CRSV";
	value: 0 | 0.5 | 1;
} | {
	tag: "EDPT";
	value: NumberOrRange;
} | {
	tag: "EHLT";
	value: NumberOrRange;
} | {
	tag: "ELGR";
	value: NumberOrRange;
} | {
	tag: "ELSH";
	value: NumberOrRange;
} | {
	tag: "FILL";
	value: NumberOrRange;
} | {
	tag: "FLAR";
	value: NumberOrRange;
} | {
	tag: "GRAD";
	value: NumberOrRange;
} | {
	tag: "HEXP";
	value: NumberOrRange;
} | {
	tag: "INFM";
	value: NumberOrRange;
} | {
	tag: "ital";
	value: 0 | 1;
} | {
	tag: "MONO";
	value: NumberOrRange;
} | {
	tag: "MUTA";
	value: NumberOrRange;
} | {
	tag: "opsz";
	value: NumberOrRange;
} | {
	tag: "ROND";
	value: NumberOrRange;
} | {
	tag: "slnt";
	value: NumberOrRange;
} | {
	tag: "SOFT";
	value: NumberOrRange;
} | {
	tag: "SPAC";
	value: NumberOrRange;
} | {
	tag: "wdth";
	value: NumberOrRange;
} | {
	tag: "wght";
	value: NumberOrRange;
} | {
	tag: "WONK";
	value: 0 | 1;
} | {
	tag: "XOPQ";
	value: NumberOrRange;
} | {
	tag: "XROT";
	value: NumberOrRange;
} | {
	tag: "XTRA";
	value: NumberOrRange;
} | {
	tag: "YEAR";
	value: NumberOrRange;
} | {
	tag: "YOPQ";
	value: NumberOrRange;
} | {
	tag: "YROT";
	value: NumberOrRange;
} | {
	tag: "YTAS";
	value: NumberOrRange;
} | {
	tag: "YTDE";
	value: NumberOrRange;
} | {
	tag: "YTFI";
	value: NumberOrRange;
} | {
	tag: "YTLC";
	value: NumberOrRange;
} | {
	tag: "YTUC";
	value: NumberOrRange;
};

export type AxisTuple = Axis[];

export type Font = {
	family: Family;
	axisTupleList?: AxisTuple[];
};

export type Options = {
	text?: string;
	display?: "auto" | "block" | "swap" | "fallback" | "optional";
};
