import {describe, expect, test} from "@jest/globals";
import {deduplicateAxisTuples, generateFontUrl, getQueryStringForAxisTupleList, mergeAxisTupleLists} from "../src/utils";

describe("getQueryStringForAxisTupleList()", () => {
	test("should return an empty string when an empty array is given", () => {
		expect(getQueryStringForAxisTupleList([])).toBe("");
	});

	test("should work as expected with only one tag and one tuple", () => {
		expect(getQueryStringForAxisTupleList([
			[{
				tag: "wght",
				value: 450,
			}],
		])).toBe("wght@450");
	});

	test("should work as expected with only one tag and multiple tuples", () => {
		expect(getQueryStringForAxisTupleList([
			[{
				tag: "wght",
				value: 450,
			}],
			[{
				tag: "wght",
				value: 500,
			}],
		])).toBe("wght@450;500");

		expect(getQueryStringForAxisTupleList([
			[{
				tag: "wght",
				value: 450,
			}],
			[{
				tag: "wght",
				value: 500,
			}],
			[{
				tag: "wght",
				value: 700,
			}],
		])).toBe("wght@450;500;700");
	});

	test("should sort tuples numerically with only one tag", () => {
		expect(getQueryStringForAxisTupleList([
			[{
				tag: "wght",
				value: 700,
			}],
			[{
				tag: "wght",
				value: 300,
			}],
			[{
				tag: "wght",
				value: 400,
			}],
		])).toBe("wght@300;400;700");
	});

	test("should work with multiple tags and one tuple", () => {
		expect(getQueryStringForAxisTupleList([
			[
				{
					tag: "ital",
					value: 1,
				},
				{
					tag: "wght",
					value: 500,
				},
			],
		])).toBe("ital,wght@1,500");

		expect(getQueryStringForAxisTupleList([
			[
				{
					tag: "ital",
					value: 1,
				},
				{
					tag: "wdth",
					value: 150,
				},
				{
					tag: "wght",
					value: 500,
				},
			],
		])).toBe("ital,wdth,wght@1,150,500");
	});

	test("should work with multiple tags and multiple tuples", () => {
		expect(getQueryStringForAxisTupleList([
			[
				{
					tag: "ital",
					value: 0,
				},
				{
					tag: "wdth",
					value: 150,
				},
				{
					tag: "wght",
					value: 500,
				},
			],
			[
				{
					tag: "ital",
					value: 1,
				},
				{
					tag: "wdth",
					value: 100,
				},
				{
					tag: "wght",
					value: 400,
				},
			],
		])).toBe("ital,wdth,wght@0,150,500;1,100,400");
	});

	test("should replace missing tags value with default values", () => {
		expect(getQueryStringForAxisTupleList([
			[
				{
					tag: "ital",
					value: 0,
				},
				{
					tag: "wdth",
					value: 150,
				},
				{
					tag: "wght",
					value: 500,
				},
			],
			[
				{
					tag: "ital",
					value: 1,
				},
				{
					tag: "wght",
					value: 400,
				},
			],
		])).toBe("ital,wdth,wght@0,150,500;1,100,400");

		expect(getQueryStringForAxisTupleList([
			[
				{
					tag: "wdth",
					value: 150,
				},
				{
					tag: "wght",
					value: 500,
				},
			],
			[
				{
					tag: "ital",
					value: 1,
				},
				{
					tag: "wght",
					value: 300,
				},
			],
			[
				{
					tag: "ital",
					value: 1,
				},
			],
		])).toBe("ital,wdth,wght@0,150,500;1,100,300;1,100,400");
	});

	test("should sort tags, sort tuples and replace missing tags values", () => {
		expect(getQueryStringForAxisTupleList([
			[
				{
					tag: "ital",
					value: 1,
				},
			],
			[
				{
					tag: "wght",
					value: 500,
				},
				{
					tag: "EHLT",
					value: 6,
				},
				{
					tag: "wdth",
					value: 150,
				},
			],
		])).toBe("EHLT,ital,wdth,wght@6,0,150,500;12,1,100,400");

		expect(getQueryStringForAxisTupleList([
			[
				{
					tag: "ital",
					value: 1,
				},
				{
					tag: "EHLT",
					value: 6,
				},
				{
					tag: "wdth",
					value: 150,
				},
			],
			[
				{
					tag: "ital",
					value: 1,
				},
				{
					tag: "wght",
					value: 500,
				},
				{
					tag: "EHLT",
					value: 6,
				},
				{
					tag: "wdth",
					value: 120,
				},
			],
		])).toBe("EHLT,ital,wdth,wght@6,1,120,500;6,1,150,400");
	});

	test("should work/sort with range", () => {
		expect(getQueryStringForAxisTupleList([
			[{
				tag: "wght",
				value: {
					min: 200,
					max: 500,
				},
			}],
		])).toBe("wght@200..500");

		expect(getQueryStringForAxisTupleList([
			[
				{
					tag: "ital",
					value: 1,
				},
				{
					tag: "EHLT",
					value: 6,
				},
				{
					tag: "wdth",
					value: {
						min: 200,
						max: 300,
					},
				},
			],
			[
				{
					tag: "ital",
					value: 1,
				},
				{
					tag: "wght",
					value: 500,
				},
				{
					tag: "EHLT",
					value: 6,
				},
				{
					tag: "wdth",
					value: {
						min: 100,
						max: 500,
					},
				},
			],
		])).toBe("EHLT,ital,wdth,wght@6,1,100..500,500;6,1,200..300,400");
	});
});

describe("generateFontUrl()", () => {
	test("should work", () => {
		expect(generateFontUrl({
			family: "Open Sans",
			axisTupleList: [
				[
					{
						tag: "ital",
						value: 1,
					},
					{
						tag: "wdth",
						value: {
							min: 75,
							max: 80,
						},
					},
				],
				[
					{
						tag: "ital",
						value: 1,
					},
					{
						tag: "wght",
						value: 500,
					},
					{
						tag: "wdth",
						value: {
							min: 70,
							max: 100,
						},
					},
				],
			],
		})).toBe("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wdth,wght@1,70..100,500;1,75..80,400");
	});
});

describe("mergeAxisTupleLists()", () => {
	test("should work with a simple merge", () => {
		expect(mergeAxisTupleLists([
			[
				{tag: "wght", value: 500},
			],
		], [
			[
				{tag: "wght", value: 600},
			],
		])).toStrictEqual([
			[
				{tag: "wght", value: 500},
			],
			[
				{tag: "wght", value: 600},
			],
		]);
	});

	test("should return false if nothing changed", () => {
		expect(mergeAxisTupleLists([
			[
				{tag: "wdth", value: 750},
			],
		], [])).toBe(false);
	});

	test("should deduplicate axis", () => {
		expect(mergeAxisTupleLists([
			[
				{tag: "wdth", value: 750},
			],
		], [
			[
				{tag: "wdth", value: 750},
			],
			[
				{tag: "ital", value: 1},
			],
		])).toStrictEqual([
			[
				{tag: "wdth", value: 750},
			],
			[
				{tag: "ital", value: 1},
			],
		]);
	});
});

describe("deduplicateAxisTuples()", () => {
	test("should do nothing if there are no duplicate axis tuples", () => {
		expect(deduplicateAxisTuples([
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 0},
			],
		])).toStrictEqual([
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 0},
			],
		]);

		expect(deduplicateAxisTuples([
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 0},
			],
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 1},
			],
		])).toStrictEqual([
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 0},
			],
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 1},
			],
		]);
	});

	test("should deduplicate explicit duplicates", () => {
		expect(deduplicateAxisTuples([
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 0},
			],
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 0},
			],
		])).toStrictEqual([
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 0},
			],
		]);
	});

	test("should deduplicate implicit duplicates", () => {
		expect(deduplicateAxisTuples([
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 0},
			],
			[
				{tag: "wght", value: 500},
			],
		])).toStrictEqual([
			[
				{tag: "wght", value: 500},
				{tag: "ital", value: 0},
			],
		]);
	});
});

